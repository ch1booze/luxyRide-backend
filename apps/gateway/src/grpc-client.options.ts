import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const adminGrpcOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'admin',
    protoPath: join(__dirname, '../../../proto/admin.proto'),
    url: '0.0.0.0:5000',
  },
};

export const customersGrpcOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'customers',
    protoPath: join(__dirname, '../../../proto/customers.proto'),
    url: '0.0.0.0:5001',
  },
};
