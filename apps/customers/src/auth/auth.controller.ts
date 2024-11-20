import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GrpcMethod } from '@nestjs/microservices';
import { SignupDto, SignupResponse } from 'libs/generated/customers';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('CustomerService', 'Signup')
  async signup(data: SignupDto): Promise<SignupResponse> {
    return this.authService.signup(data);
  }
}
