import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ApiCoreDataAccessService } from '../../core/data-access';

@Injectable()
export class ApiAuthDataAccessService {
  private readonly logger = new Logger(ApiAuthDataAccessService.name);

  constructor(
    private readonly data: ApiCoreDataAccessService,
    private jwt: JwtService
  ) {}

  register(body) {
    this.logger.verbose(`Register: ${JSON.stringify(body, null, 2)}`);
    return body;
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.data.findUserByUsername(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      token: this.jwt.sign(payload),
      user: {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        username: user.username,
      },
    };
  }
}
