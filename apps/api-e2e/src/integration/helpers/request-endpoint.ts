import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export function getEndpoint(
  app: INestApplication,
  endpoint: string,
  expect = 200
) {
  return request(app.getHttpServer()).get(endpoint).expect(expect);
}

export function postEndpoint(
  app: INestApplication,
  endpoint: string,
  data: object = {},
  expect = 201
) {
  return request(app.getHttpServer()).post(endpoint).send(data).expect(expect);
}
