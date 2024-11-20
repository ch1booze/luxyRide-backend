import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { GrpcMethod } from '@nestjs/microservices';
import { SigninDto, SigninResponse } from 'libs/generated/admin';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @GrpcMethod('Admin', 'Signin')
  async signin(data: SigninDto): Promise<SigninResponse> {
    return await this.usersService.signin(data);
  }
}
