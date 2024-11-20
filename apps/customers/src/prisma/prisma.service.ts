import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'apps/customers/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {}
