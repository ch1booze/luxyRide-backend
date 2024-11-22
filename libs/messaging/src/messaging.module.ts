import { Module } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { OtpService } from './otp.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [MessagingService, OtpService],
  exports: [MessagingService, OtpService],
})
export class MessagingModule {}
