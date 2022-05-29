import { INestApplication } from '@nestjs/common';
import { Keypair } from '@solana/web3.js';
import * as base58 from 'bs58';
import * as nacl from 'tweetnacl';
import {
  apiUrl,
  expectEndpoint,
  getEndpoint,
  initializeE2eApp,
  postEndpoint,
} from './helpers';

export function signString(secretKey: Uint8Array, payload: string) {
  const msg = Uint8Array.from(Buffer.from(payload));

  return nacl.sign.detached(msg, secretKey);
}

describe('ApiAuthFeatureController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await initializeE2eApp();
  });

  afterEach(async () => {
    return app.close();
  });

  it('should not find anything on /api/auth (GET)', async () => {
    const res = await expectEndpoint(app, apiUrl('auth'), 404);

    expect(res.body.message).toEqual('Cannot GET /api/auth');
  });

  describe('login', () => {
    it('should login posting credentials to the login endpoint', async () => {
      const data = { username: 'admin', password: 'password' };

      const res = await postEndpoint(app, apiUrl('auth/login'), data, 201);

      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user.username');
      expect(res.body.user.username).toEqual(data.username);
    });

    it('should login posting credentials to /api/auth/login (POST) and request data', async () => {
      const data = { username: 'admin', password: 'password' };

      const res = await postEndpoint(app, apiUrl('auth/login'), data, 201);

      const token = res.body?.token;

      const me = await getEndpoint(app, apiUrl('auth/me'))
        .set('authorization', `Bearer ${token}`)
        .expect(200);

      expect(me.body).toHaveProperty('sub');
      expect(me.body).toHaveProperty('username');
      expect(me.body.username).toEqual(data.username);
    });

    it('should not login with wrong username the login endpoint', async () => {
      const data = { username: 'not-admin', password: 'password' };

      const res = await postEndpoint(app, apiUrl('auth/login'), data, 401);

      expect(res.body.message).toEqual('Unauthorized');
    });

    it('should not login with wrong password the login endpoint', async () => {
      const data = { username: 'admin', password: 'not-password' };

      const res = await postEndpoint(app, apiUrl('auth/login'), data, 401);

      expect(res.body.message).toEqual('Unauthorized');
    });
  });

  describe('challenge', () => {
    const adminByteArray = JSON.parse(process.env['ADMIN_BYTE_ARRAY']);
    const adminKeypair = Keypair.fromSecretKey(Uint8Array.from(adminByteArray));
    const adminPublicKey = adminKeypair.publicKey.toBase58();
    const endpointRequest = 'auth/request-challenge';
    const endpointRespond = 'auth/respond-challenge';

    it('should receive a challenge for an existing public key', async () => {
      const res = await expectEndpoint(
        app,
        apiUrl(`${endpointRequest}/${adminPublicKey}`),
        200
      );
      expect(res.body).toHaveProperty('challenge');
    });

    it('should respond to a received challenge', async () => {
      const challengeResponse = await expectEndpoint(
        app,
        apiUrl(`${endpointRequest}/${adminPublicKey}`),
        200
      );
      expect(challengeResponse.body).toHaveProperty('challenge');

      const challenge: string = challengeResponse.body.challenge;
      const signature = signString(adminKeypair.secretKey, challenge);

      expect(signature.length).toEqual(64);

      const payload = {
        publicKey: adminPublicKey,
        challenge,
        signature: base58.encode(signature),
      };

      console.log(JSON.stringify(payload));
      const response = await postEndpoint(
        app,
        apiUrl(endpointRespond),
        payload
      );

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user.username');
    });

    describe('unexpected behavior', () => {
      it('should not receive a challenge for an unknown public key', async () => {
        const res = await expectEndpoint(
          app,
          apiUrl(`${endpointRequest}/not-existing`),
          404
        );
        expect(res.body.message).toEqual('Not Found');
      });
    });
  });

  describe('register', () => {
    it('/api/auth/register (POST)', async () => {
      const data = { username: 'my-username' };

      const res = await postEndpoint(app, apiUrl('auth/register'), data, 201);

      expect(res.body).toHaveProperty('username');
      expect(res.body.username).toEqual(data.username);
    });
  });
});
