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
    this.ensureUsers();
  }

  findUserById(userId: string) {
    return this.user.findUnique({ where: { id: userId } });
  }

  findUserByPublicKey(publicKey: string) {
    return this.user.findUnique({ where: { publicKey } });
  }

  findUserByUsername(username: string) {
    return this.user.findUnique({ where: { username } });
  }

  findUsers() {
    return this.user.findMany();
  }

  uptime() {
    return process.uptime();
  }

  private async ensureUsers() {
    const count = await this.user.count();
    if (!count) {
      const created = await this.user.create({
        data: {
          id: 'admin',
          username: 'admin',
          password: 'password',
          publicKey: process.env['ADMIN_PUBLIC_KEY'],
        },
      });
      this.logger.verbose(`Created user ${JSON.stringify(created)}`);
    }
  }
}
