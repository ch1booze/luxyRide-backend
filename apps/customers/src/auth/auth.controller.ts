import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './auth.dto';
import { User } from './user.decorator';
import { RefreshGuard } from './refresh.guard';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Signs up a new user' })
  @ApiBody({ type: SignupDto })
  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    return await this.authService.signup(dto);
  }

  @ApiOperation({ summary: 'Logs in an existing user' })
  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }
  

  @ApiOperation({ summary: 'Refresh access token for a logged in user' })
  @UseGuards(RefreshGuard)
  @Post('refresh')
  async refresh(@User() user: any) {
    return await this.authService.refresh(user);
  }

  @ApiOperation({ summary: 'Logs out a logged in user' })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@User() user: any) {
    await this.authService.logout(user);
  }
}
