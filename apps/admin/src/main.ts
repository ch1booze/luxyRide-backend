import { NestFactory } from '@nestjs/core';
import { AdminModule } from './admin.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AdminModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('ADMIN_PORT');
  await app.listen(port);
}
bootstrap();
