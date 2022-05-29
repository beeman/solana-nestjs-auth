import { INestApplication } from '@nestjs/common';
import { getEndpoint, initializeE2eApp } from './helpers';

describe('ApiCoreFeatureController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await initializeE2eApp();
  });

  afterEach(async () => {
    return app.close();
  });

  it('/api/core (GET)', async () => {
    const res = await getEndpoint(app, '/api/core', 404);

    expect(res.body.message).toEqual('Cannot GET /api/core');
  });

  it('/api/core/uptime (GET)', async () => {
    const res = await getEndpoint(app, '/api/core/uptime');

    expect(Number(res.text)).toBeGreaterThan(0.0);
  });
});
