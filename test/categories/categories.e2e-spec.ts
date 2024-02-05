import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types';
import * as request from 'supertest';
import { CategoriesModule } from '../../src/categories/categories.module';
import { TypeormTestingModule } from '../../src/typeorm/typeorm-testing.module';

describe('Categories module (e2e)', () => {
  let app: INestApplication;
  let server: App;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CategoriesModule, TypeormTestingModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    server = app.getHttpServer();
  });

  describe('/categories (GET)', () => {
    it('should return categories', () => {
      request(server).get('/categories').expect(HttpStatus.OK).expect([]);
    });
  });

  describe('/categories (POST)', () => {
    describe('valid cases', () => {
      it('should create category', async () => {
        const response = await request(server)
          .post('/categories')
          .send({ name: 'test' });

        expect(response.statusCode).toBe(HttpStatus.CREATED);
        expect(response.body).toEqual({ id: 1, name: 'test' });
      });

      it('created category should be returned by /categories (GET)', async () => {
        const response = await request(server).get('/categories');

        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body).toEqual([{ id: 1, name: 'test' }]);
      });
    });

    describe('invalid cases', () => {
      describe('no body', () => {
        it('should return 400', async () => {
          const response = await request(server).post('/categories');

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('no created categories should be returned by /categories (GET)', async () => {
          const response = await request(server).get('/categories');

          expect(response.statusCode).toBe(HttpStatus.OK);
          expect(response.body).toEqual([{ id: 1, name: 'test' }]);
        });
      });

      describe('empty body', () => {
        it('should return 400', async () => {
          const response = await request(server).post('/categories').send({});

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('no created categories should be returned by /categories (GET)', async () => {
          const response = await request(server).get('/categories');

          expect(response.statusCode).toBe(HttpStatus.OK);
          expect(response.body).toEqual([{ id: 1, name: 'test' }]);
        });
      });

      describe('name with length > 30', () => {
        it('should return 400', async () => {
          const response = await request(server).post('/categories').send({
            name: '0123456789012345678901234567891',
          });

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('no created categories should be returned by /categories (GET)', async () => {
          const response = await request(server).get('/categories');

          expect(response.statusCode).toBe(HttpStatus.OK);
          expect(response.body).toEqual([{ id: 1, name: 'test' }]);
        });
      });
    });
  });

  describe('/categories (PUT)', () => {});

  describe('/categories (DELETE)', () => {});

  afterAll(() => {
    app.close();
  });
});
