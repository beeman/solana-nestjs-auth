import { INestApplication } from '@nestjs/common';
import { getEndpoint, initializeE2eApp, postEndpoint } from './helpers';

describe('ApiAuthFeatureController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await initializeE2eApp();
  });

  afterEach(async () => {
    return app.close();
  });

  it('/api/auth (GET)', async () => {
    const res = await getEndpoint(app, '/api/auth', 404);

    expect(res.body.message).toEqual('Cannot GET /api/auth');
  });

  it('/api/auth/register (POST)', async () => {
    const data = { username: 'my-username' };

    const res = await postEndpoint(app, '/api/auth/register', data, 201);

    expect(res.body).toHaveProperty('username');
    expect(res.body.username).toEqual(data.username);
  });
});
