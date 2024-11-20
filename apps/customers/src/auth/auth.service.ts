import { Injectable } from '@nestjs/common';
import { SignupDto, SignupResponse } from 'libs/generated/customers';

@Injectable()
export class AuthService {
  signup(dto: SignupDto): SignupResponse {
    return { success: true, customerId: '123', token: JSON.stringify(dto) };
  }
}
