import { IsEmail, IsString, IsStrongPassword } from 'class-validator';
import { SignupMethod } from 'prisma/customers';

export class SignupDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

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
