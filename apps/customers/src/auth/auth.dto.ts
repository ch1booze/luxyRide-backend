import { ApiProperty } from '@nestjs/swagger';
import { SignupMethod } from '@prisma/client';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class SignupDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsStrongPassword()
  password: string;
}

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class TokenResult {
  accessToken: string;
  refreshToken: string;
}

export class ProfileDto {
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  phoneNumber?: string;
  isPhoneVerified?: boolean;
  signupMethod: SignupMethod;
}

export class VerifyEmailDto {
  email: string;
  token: string;
}

export class ResetPasswordDto {
  token: string;
  email: string;
  password: string;
}
