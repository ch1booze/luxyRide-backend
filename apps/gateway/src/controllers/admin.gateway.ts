import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiOperation } from '@nestjs/swagger';
import { SigninDto, SigninResponse } from 'apps/admin/src/admin.interface';
import { firstValueFrom, Observable } from 'rxjs';

interface AdminService {
  signin(data: SigninDto): Observable<SigninResponse>;
}

@Controller('/admin')
export class AdminGateway implements OnModuleInit {
  private adminService: AdminService;

  constructor(@Inject('ADMIN_PACKAGE') private adminClient: ClientGrpc) {}

  onModuleInit() {
    this.adminService =
      this.adminClient.getService<AdminService>('AdminService');
  }

  @Post('/signin')
  @ApiOperation({ description: 'Signin an admin via email-password.' })
  async signin(@Body() dto: SigninDto) {
    return firstValueFrom(this.adminService.signin(dto));
  }
}
