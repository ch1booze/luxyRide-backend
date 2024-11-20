import { Injectable } from '@nestjs/common';
import { SignupDto, SignupResponse } from 'libs/generated/customers';
import { PrismaService } from '../prisma/prisma.service';
import { SignupMethod } from 'apps/customers/prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async signup(dto: SignupDto): Promise<SignupResponse> {
    await this.prismaService.user.create({
      data: {
        email: dto.email,
        passwordHash: dto.password,
        firstName: dto.firstName,
        lastName: dto.lastName,
        signupMethod: SignupMethod.EMAIL_PASSWORD,
      },
    });

    return { accessToken: '1234567890' };
  }
}
