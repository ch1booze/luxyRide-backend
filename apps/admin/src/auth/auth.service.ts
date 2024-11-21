import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SigninDto, SigninResult } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async signin(dto: SigninDto): Promise<SigninResult> {
    return { accessToken: '1234567890' };
  }
}
