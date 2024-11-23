import { Injectable } from '@nestjs/common';
import { SigninDto, SigninResult } from './auth.dto';
import { DatabaseService } from 'library/database';

@Injectable()
export class AuthService {
  constructor(private databaseService: DatabaseService) {}

  async signin(dto: SigninDto): Promise<SigninResult> {
    return { accessToken: '1234567890' };
  }
}
