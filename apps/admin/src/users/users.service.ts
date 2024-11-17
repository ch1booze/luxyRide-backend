import { Injectable } from '@nestjs/common';
import { SigninDto, SigninResponse } from './users.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  signin(dto: SigninDto): SigninResponse {
    return { token: JSON.stringify(dto) };
  }
}
