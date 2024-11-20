import { NestFactory } from '@nestjs/core';
import { AdminModule } from './admin.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AdminModule);
  const configService = appContext.get(ConfigService);
  const PORT = configService.get<number>('ADMIN_PORT');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AdminModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'admin',
        protoPath: join(__dirname, '../../../proto/admin.proto'),
        url: `localhost:${PORT}`,
      },
    },
  );
  await app.listen();
}
bootstrap();
