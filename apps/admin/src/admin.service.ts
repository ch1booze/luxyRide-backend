import { Injectable } from '@nestjs/common';
import { SigninDto, SigninResponse } from './admin.interface';

@Injectable()
export class AdminService {
  signin(dto: SigninDto): SigninResponse {
    return { token: JSON.stringify(dto) };
  }
}
