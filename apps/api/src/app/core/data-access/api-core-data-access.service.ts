import { Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export class ApiCoreDataAccessService
  extends PrismaClient
  implements OnModuleInit
{
  private readonly logger = new Logger(ApiCoreDataAccessService.name);

  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  getUserById(userId: string) {
    return this.user.findUnique({
      where: { id: userId },
    });
  }

  uptime() {
    return process.uptime();
  }
}
