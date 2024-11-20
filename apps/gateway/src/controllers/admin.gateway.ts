import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiOperation } from '@nestjs/swagger';
import { SigninDto, SigninResponse } from 'libs/generated/admin';
import { firstValueFrom, Observable } from 'rxjs';

interface AdminApp {
  signin(data: SigninDto): Observable<SigninResponse>;
}

@Controller('/admin')
export class AdminGateway implements OnModuleInit {
  private adminApp: AdminApp;

  constructor(@Inject('ADMIN_PACKAGE') private adminClient: ClientGrpc) {}

  onModuleInit() {
    this.adminApp = this.adminClient.getService<AdminApp>('AdminApp');
  }

  @Post('/users/signin')
  @ApiOperation({ description: 'Signin an admin via email-password.' })
  async signin(@Body() dto: SigninDto) {
    return firstValueFrom(this.adminApp.signin(dto));
  }
}
