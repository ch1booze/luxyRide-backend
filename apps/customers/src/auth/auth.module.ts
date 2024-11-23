import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { MessagingModule } from 'library/messaging';
import { DatabaseModule } from 'library/database';

@Module({
  imports: [JwtModule, MessagingModule, DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
