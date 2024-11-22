import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OtpService {
  constructor(private configService: ConfigService) {}

  async generateOtp(): Promise<string> {
    const secret = this.configService.get('OTP_SECRET');
    const token = speakeasy.totp({ secret, encoding: 'base64' });
    return token;
  }

  async validateOtp(token: string): Promise<boolean> {
    const isValid = speakeasy.totp.verify({
      secret: this.configService.get('OTP_SECRET'),
      token,
      encoding: 'base32',
      window: 25,
    });

    return isValid;
  }
}
