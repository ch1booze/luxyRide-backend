import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signin(@Body() dto: SigninDto) {
    return await this.authService.signin(dto);
  }
}
