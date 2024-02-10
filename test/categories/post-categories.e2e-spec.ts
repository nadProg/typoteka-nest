import { Repository } from 'typeorm';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import * as request from 'supertest';

import { Category } from '../../src/categories/entities/category.entity';

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
  });

  describe('/categories (POST)', () => {
    describe('valid cases', () => {
      beforeAll(async () => {
        await populateDataset({ categoriesRepository });
      });

      it('should create category', async () => {
        const response = await request(server)
          .post('/categories')
          .send({ name: 'created category' });

        expect(response.statusCode).toBe(HttpStatus.CREATED);
        expect(response.body).toEqual({ id: 3, name: 'created category' });
      });

      it('created category should be returned by /categories (GET)', async () => {
        const response = await request(server).get('/categories');

        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body).toEqual([
          { id: 1, name: 'category 1' },
          { id: 2, name: 'category 2' },
          { id: 3, name: 'created category' },
        ]);
      });

      afterAll(async () => {
        await resetDataset({ categoriesRepository });
      });
    });

    describe('invalid cases', () => {
      beforeAll(async () => {
        await populateDataset({ categoriesRepository });
      });

      describe('no body', () => {
        it('should return 400', async () => {
          const response = await request(server).post('/categories');

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('no created categories should be returned by /categories (GET)', async () => {
          const response = await request(server).get('/categories');

          expect(response.statusCode).toBe(HttpStatus.OK);
          expect(response.body).toEqual([
            { id: 1, name: 'category 1' },
            { id: 2, name: 'category 2' },
          ]);
        });
      });

      describe('empty body', () => {
        it('should return 400', async () => {
          const response = await request(server).post('/categories').send({});

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('no created categories should be returned by /categories (GET)', async () => {
          const response = await request(server).get('/categories');

          expect(response.body).toEqual([
            { id: 1, name: 'category 1' },
            { id: 2, name: 'category 2' },
          ]);
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
          expect(response.body).toEqual([
            { id: 1, name: 'category 1' },
            { id: 2, name: 'category 2' },
          ]);
        });
      });

      afterAll(async () => {
        await resetDataset({ categoriesRepository });
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
