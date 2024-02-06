import { HttpStatus, INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import { App } from 'supertest/types';
import * as request from 'supertest';
import { Category } from '../../src/categories/entities/category';
import { initCategoriesTestingModule } from './helpers/init-categories-testing-module';
import { populateDataset } from './helpers/populate-dataset';
import { resetDataset } from './helpers/reset-dataset';

describe('Categories module (e2e)', () => {
  let app: INestApplication;
  let server: App;
  let categoriesRepository: Repository<Category>;
  let response: request.Response;

  beforeAll(async () => {
    ({ app, server, categoriesRepository } =
      await initCategoriesTestingModule());

    await populateDataset({ categoriesRepository });
  });

  describe('/categories (GET)', () => {
    beforeAll(async () => {
      response = await request(server).get('/categories');
    });

    it('status code should be 200', () => {
      expect(response.statusCode).toBe(HttpStatus.OK);
    });

    it('should return categories from repository', () => {
      expect(response.body).toEqual([
        { id: 1, name: 'category 1' },
        { id: 2, name: 'category 2' },
      ]);
    });
  });

  afterAll(() => {
    app.close();
    resetDataset({ categoriesRepository });
  });
});
