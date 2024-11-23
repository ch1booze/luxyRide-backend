import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DriversModule } from './drivers.module';

async function bootstrap() {
  const app = await NestFactory.create(DriversModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('DRIVERS_PORT');

  const config = new DocumentBuilder()
    .setTitle('LuxyRide Drivers API Specification')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(port);
}
bootstrap();
