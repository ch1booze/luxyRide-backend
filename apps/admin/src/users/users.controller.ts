import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { GrpcMethod } from '@nestjs/microservices';
import { SigninDto, SigninResponse } from './users.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @GrpcMethod('AdminApp', 'Signin')
  async signin(data: SigninDto): Promise<SigninResponse> {
    return this.usersService.signin(data);
  }
}
