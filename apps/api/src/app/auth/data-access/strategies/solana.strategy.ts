import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { PublicKey } from '@solana/web3.js';
import * as bs58 from 'bs58';
import * as b58 from 'bs58';
import { Strategy } from 'passport-custom';
import * as nacl from 'tweetnacl';
import { ApiAuthDataAccessService } from '../api-auth-data-access.service';

export function verifySignature(
  publicKey: string,
  challenge: string,
  signature: string
) {
  return nacl.sign.detached.verify(
    Uint8Array.from(Buffer.from(challenge)),
    b58.decode(signature),
    new PublicKey(publicKey).toBuffer()
  );
}

function challengeExpired(challenge: string) {
  const decoded = Buffer.from(bs58.decode(challenge)).toString('utf-8');
  const expiresAt = new Date(Number(decoded.split('.')[1])).getTime();
  const now = new Date().getTime();

  return expiresAt < now;
}

@Injectable()
export class SolanaStrategy extends PassportStrategy(Strategy, 'solana') {
  constructor(private auth: ApiAuthDataAccessService) {
    super();
  }

  async validate(req): Promise<any> {
    const {
      challenge,
      publicKey,
      signature,
    }: { challenge: string; publicKey: string; signature: string } = req.body;

    if (!challenge || !publicKey || !signature) {
      throw new BadRequestException();
    }

    // Verify it
    const verified = verifySignature(publicKey, challenge, signature);

    if (!verified) {
      return false;
    }

    // Get expiresAt from challenge
    if (!challengeExpired(challenge)) {
      return this.auth.findUserByPublicKey(publicKey);
    }
    return false;
  }
}
