import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupMethod } from 'apps/customers/prisma/client';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, SignupDto, SignupResult } from './auth.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  private async generateAccessToken(dto: any) {
    const secret = this.configService.get('CUSTOMERS_TOKEN_SECRET');
    return await this.jwtService.signAsync(dto, { secret, expiresIn: 30 });
  }

  private async generateRefreshToken(dto: any) {
    const secret = this.configService.get('CUSTOMERS_TOKEN_SECRET');
    return await this.jwtService.signAsync(dto, { secret, expiresIn: '7d' });
  }

  async isUserLoggedIn(id: string) {
    return await this.prismaService.user.findUnique({
      where: { id },
      select: { isLoggedIn: true },
    });
  }

  async signup(dto: SignupDto): Promise<SignupResult> {
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
        isLoggedIn: true,
      },
    });

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken({
        sub: createdUser.id,
        email: createdUser.email,
      }),
      this.generateRefreshToken({ sub: createdUser.id }),
    ]);

    return { accessToken, refreshToken };
  }

  async login(dto: LoginDto) {
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
      throw new BadRequestException();
    }

    const [_, accessToken, refreshToken] = await Promise.all([
      this.prismaService.user.update({
        data: { isLoggedIn: true },
        where: { id: foundUser.id },
      }),
      this.generateAccessToken({
        sub: foundUser.id,
        email: foundUser.email,
      }),
      this.generateRefreshToken({ sub: foundUser.id }),
    ]);

    return { accessToken, refreshToken };
  }

  async refresh(user: any) {
    const foundUser = await this.prismaService.user.findUnique({
      where: { id: user.id },
    });

    if (!(await this.isUserLoggedIn(foundUser.id))) {
      throw new UnauthorizedException();
    }

    return await this.generateAccessToken({
      sub: foundUser.id,
      email: foundUser.email,
    });
  }

  async logout(user: any) {
    const foundUser = await this.prismaService.user.findUnique({
      where: { id: user.id },
    });

    await this.prismaService.user.update({
      data: { isLoggedIn: false },
      where: { id: foundUser.id },
    });
  }
}
