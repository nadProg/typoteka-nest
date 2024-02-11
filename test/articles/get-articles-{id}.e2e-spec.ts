import { HttpStatus, INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import { App } from 'supertest/types';
import * as request from 'supertest';

import { Article } from '../../src/articles/entities/article.entity';
import { Category } from '../../src/categories/entities/category.entity';

import { initArticlesTestingModule } from './helpers/init-articles-testing-module';
import { populateDataset } from './helpers/populate-dataset';
import { resetDataset } from './helpers/reset-dataset';

describe('Articles module (e2e)', () => {
  let app: INestApplication;
  let server: App;
  let articlesRepository: Repository<Article>;
  let categoriesRepository: Repository<Category>;
  let response: request.Response;

  beforeAll(async () => {
    ({ app, server, articlesRepository, categoriesRepository } =
      await initArticlesTestingModule());

    await populateDataset({ articlesRepository, categoriesRepository });
  });

  describe('/articles/:id (GET)', () => {
    describe('valid cases', () => {
      beforeAll(async () => {
        response = await request(server).get('/articles/1');
      });

      it('status code should be 200', () => {
        expect(response.statusCode).toBe(HttpStatus.OK);
      });

      it('should return articles from repository', () => {
        expect(response.body).toEqual({
          id: 1,
          title: 'article 1',
          announce: 'announce',
          content: 'content',
          image: 'image',
          categories: [
            {
              id: 1,
              name: 'category 1',
            },
            {
              id: 3,
              name: 'category 3',
            },
            {
              id: 5,
              name: 'category 5',
            },
          ],
        });
      });
    });

    describe('invalid cases', () => {
      beforeAll(async () => {
        response = await request(server).get('/articles/4');
      });

      it('status code should be 404', () => {
        expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
      });
    });
  });

  afterAll(async () => {
    await resetDataset({ articlesRepository, categoriesRepository });
    await app.close();
  });
});
