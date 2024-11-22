import { NestFactory } from '@nestjs/core';
import { AdminModule } from './admin.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AdminModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('ADMIN_PORT');
  const config = new DocumentBuilder()
    .setTitle('LuxyRide Admin API Specification')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(port);
}
bootstrap();
