import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../../../prisma/customers';


@Injectable()
export class PrismaService extends PrismaClient {}
