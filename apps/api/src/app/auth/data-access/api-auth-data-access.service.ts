import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Keypair, PublicKey } from '@solana/web3.js';
import * as bs58 from 'bs58';
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

  async requestChallenge(publicKey: string) {
    const user = await this.data.findUserByPublicKey(publicKey);
    if (!user) {
      throw new NotFoundException();
    }
    const random = Keypair.generate().publicKey.toBase58();
    const expiresAt = new Date().getTime() + 60_000;
    const challenge = `${random}.${expiresAt}`;

    this.logger.verbose(`requestChallenge: ${publicKey}, ${challenge}`);
    const buffer = Buffer.from(challenge);
    const encoded = bs58.encode(buffer);

    return { challenge: encoded };
  }

  async findUserByPublicKey(publicKey: string) {
    const user = await this.data.findUserByPublicKey(publicKey);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
}
