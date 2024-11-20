import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiOperation } from '@nestjs/swagger';
import {
  CustomersClientImpl,
  SignupDto,
  SignupResponse,
} from 'libs/generated/customers';

@Controller('customers/auth')
export class AuthController implements OnModuleInit {
  private customersClientImpl: CustomersClientImpl;

  constructor(@Inject('CUSTOMER_PACKAGE') private customerClient: ClientGrpc) {}

  onModuleInit() {
    this.customersClientImpl =
      this.customerClient.getService<CustomersClientImpl>('Customers');
  }

  @Post('/signup')
  @ApiOperation({ description: 'Signups a user via email-password.' })
  async signup(@Body() dto: SignupDto): Promise<SignupResponse> {
    return this.customersClientImpl.Signup(dto);
  }
}
