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
  });

  describe('/categories (PUT)', () => {
    describe('valid cases', () => {
      beforeAll(async () => {
        await populateDataset({ categoriesRepository });
      });

      it('should update category', async () => {
        const response = await request(server)
          .put('/categories/1')
          .send({ name: 'category 1 updated' });

        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body).toEqual({ id: 1, name: 'category 1 updated' });
      });

      it('updated category should be returned by /categories (GET)', async () => {
        const response = await request(server).get('/categories');

        expect(response.body).toEqual([
          { id: 1, name: 'category 1 updated' },
          { id: 2, name: 'category 2' },
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

      describe('non existent category', () => {
        it('should return 404', async () => {
          const response = await request(server)
            .put('/categories/3')
            .send({ name: 'updated test' });

          expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
        });

        it('should not affect result returned by /categories (GET)', async () => {
          const response = await request(server).get('/categories');
          expect(response.body).toEqual([
            { id: 1, name: 'category 1' },
            { id: 2, name: 'category 2' },
          ]);
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
          expect(response.body).toEqual([
            { id: 1, name: 'category 1' },
            { id: 2, name: 'category 2' },
          ]);
        });
      });

      describe('empty body', () => {
        it('should return 400', async () => {
          const response = await request(server).put('/categories/1').send({});

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('should not affect result returned by /categories (GET)', async () => {
          const response = await request(server).get('/categories');

          expect(response.body).toEqual([
            { id: 1, name: 'category 1' },
            { id: 2, name: 'category 2' },
          ]);
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
