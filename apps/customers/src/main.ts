import { NestFactory } from '@nestjs/core';
import { CustomersModule } from './customers.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(CustomersModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('CUSTOMERS_PORT');

  const config = new DocumentBuilder()
    .setTitle('LuxyRide Customers API Specification')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(port);
}
bootstrap();
