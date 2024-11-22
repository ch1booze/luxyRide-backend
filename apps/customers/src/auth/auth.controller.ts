import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDto,
  ResetPasswordDto,
  SignupDto,
  VerifyEmailDto,
} from './auth.dto';
import { User } from './user.decorator';
import { RefreshGuard } from './refresh.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Signs up a user' })
  @ApiBody({ type: SignupDto })
  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    return await this.authService.signup(dto);
  }

  @ApiOperation({ summary: 'Logs in a user' })
  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }

  @ApiOperation({ summary: "Get a user's profile information" })
  @ApiBearerAuth()
  @Get('profile')
  async profile(@User() user: any) {
    return await this.authService.profile(user);
  }

  @ApiOperation({ summary: 'Refresh access token for a user' })
  @UseGuards(RefreshGuard)
  @Post('refresh')
  async refresh(@User() user: any) {
    return await this.authService.refresh(user);
  }

  @ApiOperation({ summary: 'Logs out a user' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@User() user: any) {
    await this.authService.logout(user);
  }

  @ApiOperation({ summary: "Send verification code to a user's email" })
  @ApiQuery({ name: 'email', type: String })
  @Post('email-verification/send')
  async sendVerificationEmail(@Query('email') email: string) {
    return await this.authService.sendVerificationEmail(email);
  }

  @ApiOperation({ summary: "Verify a user's email" })
  @ApiQuery({ name: 'email', type: String })
  @ApiQuery({ name: 'token', type: String })
  @Post('email-verification/verify')
  async verifyEmail(@Query() dto: VerifyEmailDto) {
    return await this.authService.verifyEmail(dto);
  }

  @ApiOperation({ summary: "Send a password reset to a user's email" })
  @ApiQuery({ name: 'email', type: String })
  @Post('password-reset/send')
  async sendPasswordReset(@Query('email') email: string) {
    return await this.authService.sendPasswordResetEmail(email);
  }

  @ApiOperation({ summary: 'Reset password for user' })
  @ApiQuery({ name: 'token', type: String })
  @ApiQuery({ name: 'email', type: String })
  @ApiQuery({ name: 'password', type: String })
  @Post('password-reset/verify')
  async resetPassword(@Query() dto: ResetPasswordDto) {
    return await this.authService.resetPassword(dto);
  }
}
