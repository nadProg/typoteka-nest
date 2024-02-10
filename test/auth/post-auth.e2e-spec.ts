import { HttpStatus, INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import * as request from 'supertest';

import { initAuthTestingModule } from './helpers/init-auth-testing-module';

describe('Auth module (e2e)', () => {
  let app: INestApplication;
  let server: App;

  beforeAll(async () => {
    ({ app, server } = await initAuthTestingModule());
  });

  describe('/auth (POST)', () => {
    describe('valid cases', () => {
      beforeAll(async () => {});

      it('should create auth', async () => {
        const response = await request(server).post('/auth').send({
          email: 'email@gmail.com',
          password: 'password',
        });

        expect(response.statusCode).toBe(HttpStatus.CREATED);
        expect(response.body).toHaveProperty('userId');
        expect(response.body).toHaveProperty('token');
      });

      afterAll(async () => {});
    });

    describe('invalid cases', () => {
      beforeAll(async () => {});

      describe('no body', () => {
        it('should return 400', async () => {
          const response = await request(server).post('/auth');

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });
      });

      describe('empty body', () => {
        it('should return 400', async () => {
          const response = await request(server).post('/auth').send({});

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });
      });

      describe('no email', () => {
        it('should return 422', async () => {
          const response = await request(server).post('/auth').send({
            password: 'p',
          });

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });
      });

      describe('no password', () => {
        it('should return 400', async () => {
          const response = await request(server).post('/auth').send({
            email: 'mail@gmail.com',
          });

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });
      });

      afterAll(async () => {});
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
