import { Controller } from '@nestjs/common';
import { AdminService } from './admin.service';
import { GrpcMethod } from '@nestjs/microservices';
import { SigninDto, SigninResponse } from './admin.interface';

@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @GrpcMethod('AdminService', 'Signin')
  async signin(data: SigninDto): Promise<SigninResponse> {
    return this.adminService.signin(data);
  }
}
