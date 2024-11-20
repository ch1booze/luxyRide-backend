import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiOperation } from '@nestjs/swagger';
import {
  AdminClientImpl,
  SigninDto,
  SigninResponse,
} from 'libs/generated/admin';

@Controller('admin/users')
export class UsersController implements OnModuleInit {
  private adminClientImpl: AdminClientImpl;
  constructor(@Inject('ADMIN_PACKAGE') private adminClient: ClientGrpc) {}

  onModuleInit() {
    this.adminClientImpl =
      this.adminClient.getService<AdminClientImpl>('Admin');
  }

  @Post('/signin')
  @ApiOperation({ description: 'Signin an admin via email-password.' })
  async signin(@Body() dto: SigninDto): Promise<SigninResponse> {
    return this.adminClientImpl.Signin(dto);
  }
}
