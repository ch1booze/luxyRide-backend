import { NestFactory } from '@nestjs/core';
import { CustomersModule } from './customers.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(CustomersModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('CUSTOMERS_PORT');
  await app.listen(port);
}
bootstrap();
