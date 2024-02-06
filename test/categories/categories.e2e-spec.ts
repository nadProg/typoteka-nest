import { Repository } from 'typeorm';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import * as request from 'supertest';

import { Category } from '../../src/categories/entities/category';

import { resetDataset } from './helpers/reset-dataset';
import { populateDataset } from './helpers/populate-dataset';
import { initCategoriesTestingModule } from './helpers/init-categories-testing-module';

describe('Categories module (e2e)', () => {
  let app: INestApplication;
  let server: App;
  let categoriesRepository: Repository<Category>;

  beforeAll(async () => {
    ({ app, server, categoriesRepository } =
      await initCategoriesTestingModule());

    await populateDataset({ categoriesRepository });
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

  describe('/categories (PUT)', () => {
    describe('valid cases', () => {
      it('should update category', async () => {
        const response = await request(server)
          .put('/categories/1')
          .send({ name: 'updated test' });

        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body).toEqual({ id: 1, name: 'updated test' });
      });

      it('updated category should be returned by /categories (GET)', async () => {
        const response = await request(server).get('/categories');

        expect(response.body).toEqual([{ id: 1, name: 'updated test' }]);
      });
    });

    describe('invalid cases', () => {
      describe('non existent category', () => {
        it('should return 404', async () => {
          const response = await request(server)
            .put('/categories/2')
            .send({ name: 'updated test' });

          expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
        });

        it('should not affect result returned by /categories (GET)', async () => {
          const response = await request(server).get('/categories');
          expect(response.body).toEqual([{ id: 1, name: 'updated test' }]);
        });
      });

      describe('no body', () => {
        it('should return 400', async () => {
          const response = await request(server).put('/categories/1');

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('should not affect result returned by /categories (GET)', async () => {
          const response = await request(server).get('/categories');

          expect(response.statusCode).toBe(HttpStatus.OK);
          expect(response.body).toEqual([{ id: 1, name: 'updated test' }]);
        });
      });

      describe('empty body', () => {
        it('should return 400', async () => {
          const response = await request(server).put('/categories/1').send({});

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('should not affect result returned by /categories (GET)', async () => {
          const response = await request(server).get('/categories');

          expect(response.body).toEqual([{ id: 1, name: 'updated test' }]);
        });
      });

      describe('name with length > 30', () => {
        it('should return 400', async () => {
          const response = await request(server).put('/categories/1').send({
            name: '0123456789012345678901234567891',
          });

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('should not affect result returned by /categories (GET)', async () => {
          const response = await request(server).get('/categories');

          expect(response.body).toEqual([{ id: 1, name: 'updated test' }]);
        });
      });
    });
  });

  describe('/categories (DELETE)', () => {
    describe('invalid cases', () => {
      describe('non existent category', () => {
        it('should return 404', async () => {
          const response = await request(server).delete('/categories/2');
          expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
        });

        it('should not affect result returned by /categories (GET)', async () => {
          const response = await request(server).get('/categories');
          expect(response.body).toEqual([{ id: 1, name: 'updated test' }]);
        });
      });
    });

    describe('valid cases', () => {
      it('should return 204', async () => {
        const response = await request(server).delete('/categories/1');
        expect(response.statusCode).toBe(HttpStatus.NO_CONTENT);
        expect(response.body).toEqual({});
      });

      it('deleted category should not be returned by /categories (GET)', async () => {
        const response = await request(server).get('/categories');
        expect(response.body).toEqual([]);
      });
    });
  });

  afterAll(async () => {
    await resetDataset({ categoriesRepository });
    await app.close();
  });
});
