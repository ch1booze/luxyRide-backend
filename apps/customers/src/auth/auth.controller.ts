import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './auth.dto';
import { AuthGuard } from './auth.guard';
import { User } from './user.decorator';
import { RefreshGuard } from './refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    return await this.authService.signup(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }

  @UseGuards(RefreshGuard)
  @Post('refresh')
  async refresh(@User() user: any) {
    return await this.authService.refresh(user);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@User() user: any) {
    await this.authService.logout(user);
  }
}
