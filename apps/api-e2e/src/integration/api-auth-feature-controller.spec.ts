import { INestApplication } from '@nestjs/common';
import {
  apiUrl,
  expectEndpoint,
  getEndpoint,
  initializeE2eApp,
  postEndpoint,
} from './helpers';

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

  describe('register', () => {
    it('/api/auth/register (POST)', async () => {
      const data = { username: 'my-username' };

      const res = await postEndpoint(app, apiUrl('auth/register'), data, 201);

      expect(res.body).toHaveProperty('username');
      expect(res.body.username).toEqual(data.username);
    });
  });
});
