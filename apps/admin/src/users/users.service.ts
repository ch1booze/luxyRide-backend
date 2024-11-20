import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SigninDto, SigninResponse } from 'libs/generated/admin';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  signin(dto: SigninDto): SigninResponse {
    return { token: JSON.stringify(dto) };
  }
}
