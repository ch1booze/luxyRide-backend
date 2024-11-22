import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupMethod } from '../../../../prisma/customers';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  LoginDto,
  ProfileDto,
  ResetPasswordDto,
  SignupDto,
  TokenResult,
  VerifyEmailDto,
} from './auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { MessagingService, OtpService } from 'library/messaging';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    private messagingService: MessagingService,
    private otpService: OtpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private async generateAccessToken(dto: any) {
    const secret = this.configService.get('CUSTOMERS_TOKEN_SECRET');
    return await this.jwtService.signAsync(dto, { secret, expiresIn: '30m' });
  }

  private async generateRefreshToken(dto: any) {
    const secret = this.configService.get('CUSTOMERS_TOKEN_SECRET');
    return await this.jwtService.signAsync(dto, { secret, expiresIn: '7d' });
  }

  async signup(dto: SignupDto): Promise<TokenResult> {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new BadRequestException();
    }

    const passwordHash = await argon2.hash(dto.password, {
      secret: Buffer.from(this.configService.get('CUSTOMERS_PASSWORD_SECRET')),
    });
    const createdUser = await this.prismaService.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        passwordHash,
        signupMethod: SignupMethod.EMAIL_PASSWORD,
      },
    });

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken({
        sub: createdUser.id,
        email: createdUser.email,
      }),
      this.generateRefreshToken({ sub: createdUser.id }),
    ]);

    await this.cacheManager.set(createdUser.id, refreshToken, 0);
    return { accessToken, refreshToken };
  }

  async login(dto: LoginDto): Promise<TokenResult> {
    const foundUser = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });
    if (!foundUser) {
      throw new BadRequestException();
    }

    const isPasswordVerified = await argon2.verify(
      foundUser.passwordHash,
      dto.password,
      {
        secret: Buffer.from(
          this.configService.get('CUSTOMERS_PASSWORD_SECRET'),
        ),
      },
    );

    if (!isPasswordVerified) {
      throw new UnauthorizedException();
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken({
        sub: foundUser.id,
        email: foundUser.email,
      }),
      this.generateRefreshToken({ sub: foundUser.id }),
    ]);

    await this.cacheManager.set(foundUser.id, refreshToken, 0);
    return { accessToken, refreshToken };
  }

  async profile(user: any): Promise<ProfileDto> {
    const foundUser = await this.prismaService.user.findUnique({
      where: { id: user.id },
    });

    const { passwordHash, id, createdAt, ...profileDto } = foundUser;
    return profileDto;
  }

  async refresh(user: any): Promise<TokenResult> {
    const foundUser = await this.prismaService.user.findUnique({
      where: { id: user.id },
    });

    if (!(await this.cacheManager.get(foundUser.id))) {
      throw new UnauthorizedException();
    }
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken({
        sub: foundUser.id,
        email: foundUser.email,
      }),
      this.generateRefreshToken({ sub: foundUser.id }),
    ]);

    await this.cacheManager.set(foundUser.id, refreshToken, 0);
    return { accessToken, refreshToken };
  }

  async logout(user: any) {
    const foundUser = await this.prismaService.user.findUnique({
      where: { id: user.id },
    });

    await this.cacheManager.del(foundUser.id);
  }

  async sendVerificationEmail(email: string) {
    const foundUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    const name = foundUser.firstName + ' ' + foundUser.lastName;
    const token = await this.otpService.generateOtp();

    if (foundUser.signupMethod === SignupMethod.EMAIL_PASSWORD) {
      await this.messagingService.sendEmail({
        name,
        contact: email,
        subject: 'Verify Email',
        message: `Token: ${token}`,
      });
    }
  }

  async verifyEmail(dto: VerifyEmailDto) {
    if (await this.otpService.validateOtp(dto.token)) {
      this.prismaService.user.update({
        where: { email: dto.email },
        data: { isEmailVerified: true },
      });
    }
  }

  async sendPasswordResetEmail(email: string) {
    const foundUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    const name = foundUser.firstName + ' ' + foundUser.lastName;
    const token = await this.otpService.generateOtp();

    if (foundUser.signupMethod === SignupMethod.EMAIL_PASSWORD) {
      await this.messagingService.sendEmail({
        name,
        contact: email,
        subject: 'Reset Password',
        message: `Token: ${token}`,
      });
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    if (await this.otpService.validateOtp(dto.token)) {
      const passwordHash = await argon2.hash(dto.password, {
        secret: Buffer.from(
          this.configService.get('CUSTOMERS_PASSWORD_SECRET'),
        ),
      });

      await this.prismaService.user.update({
        where: { email: dto.email },
        data: { passwordHash },
      });
    }
  }
}
