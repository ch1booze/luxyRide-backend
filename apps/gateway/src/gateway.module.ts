import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { adminGrpcOptions, customersGrpcOptions } from './grpc-client.options';
import { CustomersGateway } from './controllers/customers.gateway.';
import { AdminGateway } from './controllers/admin.gateway';

@Module({
  imports: [
    ClientsModule.register([
      { name: 'ADMIN_PACKAGE', ...adminGrpcOptions },
      {
        name: 'CUSTOMER_PACKAGE',
        ...customersGrpcOptions,
      },
    ]),
  ],
  controllers: [AdminGateway, CustomersGateway],
})
export class GatewayModule {}
