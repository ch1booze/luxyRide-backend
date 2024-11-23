import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'library/database';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AdminModule {}
