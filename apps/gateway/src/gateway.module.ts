import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { UsersController as AdminUsersController } from './admin/users.controller';
import { AuthController as CustomersAuthController } from './customers/auth.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ADMIN_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'admin',
          protoPath: join(__dirname, '../../../libs/protos/admin.proto'),
          url: '0.0.0.0:5000',
        },
      },
      {
        name: 'CUSTOMER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'customers',
          protoPath: join(__dirname, '../../../libs/protos/customers.proto'),
          url: '0.0.0.0:5001',
        },
      },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AdminUsersController, CustomersAuthController],
})
export class GatewayModule {}
