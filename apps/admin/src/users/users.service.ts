import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SigninDto, SigninResponse } from 'libs/generated/admin';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async signin(dto: SigninDto): Promise<SigninResponse> {
    await this.prismaService.user.findUnique({
      where: { email: dto.email, passwordHash: dto.password },
    });
    return { accessToken: '1234567890' };
  }
}
