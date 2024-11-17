import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  async onModuleInit() {
    // Seed the database
    const superUserRole = await this.createRolesAndPermissions();
    await this.createSuperUser(superUserRole.id);
  }

  private async createSuperUser(superUserRoleId: string) {
    const superAdminUser = this.configService.get<string>('SUPER_ADMIN_USER');
    const superAdminPassword = this.configService.get<string>(
      'SUPER_ADMIN_PASSWORD',
    );
    await this.user.upsert({
      where: { email: superAdminUser },
      update: {},
      create: {
        email: superAdminUser,
        passwordHash: superAdminPassword,
        roleId: superUserRoleId,
      },
    });
  }

  private async createRolesAndPermissions() {
    // Create super user role
    const superUserRole = await this.role.upsert({
      where: { name: 'SUPER' },
      update: {},
      create: { name: 'SUPER', description: 'A super user.' },
    });

    // Create permissions
    const permissions = [
      { name: 'CREATE_DRIVER', description: 'Create a new driver.' },
      { name: 'CREATE_USER', description: 'Create a new user.' },
      {
        name: 'DELETE_DRIVER',
        description: "Delete an existing driver's details.",
      },
      { name: 'VIEW_USER', description: "View a user's profile." },
    ];

    const createdPermissions = await this.$transaction(
      permissions.map((p) => {
        return this.permission.upsert({
          where: { name: p.name },
          update: {},
          create: { name: p.name, description: p.description },
        });
      }),
    );

    // Assign all permissions to super user
    await this.rolePermissions.createMany({
      data: createdPermissions.map((p) => {
        return { roleId: superUserRole.id, permissionId: p.id };
      }),
    });

    return superUserRole;
  }
}