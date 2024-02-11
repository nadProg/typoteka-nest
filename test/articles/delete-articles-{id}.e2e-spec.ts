import { Repository } from 'typeorm';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import * as request from 'supertest';

import { Article } from '../../src/articles/entities/article.entity';
import { Category } from '../../src/categories/entities/category.entity';

import { resetDataset } from './helpers/reset-dataset';
import { populateDataset } from './helpers/populate-dataset';
import { initArticlesTestingModule } from './helpers/init-articles-testing-module';

describe('Articles module (e2e)', () => {
  let app: INestApplication;
  let server: App;
  let articlesRepository: Repository<Article>;
  let categoriesRepository: Repository<Category>;

  beforeAll(async () => {
    ({ app, server, articlesRepository, categoriesRepository } =
      await initArticlesTestingModule());
  });

  describe('/articles (DELETE)', () => {
    describe('valid cases', () => {
      beforeAll(async () => {
        await populateDataset({ articlesRepository, categoriesRepository });
      });

      it('should return 204', async () => {
        const response = await request(server).delete('/articles/1');
        expect(response.statusCode).toBe(HttpStatus.NO_CONTENT);
        expect(response.body).toEqual({});
      });

      it('deleted article should not be returned by /articles (GET)', async () => {
        const response = await request(server).get('/articles');
        expect(response.body).toEqual([
          {
            id: 2,
            title: 'article 2',
            announce: 'announce',
            content: 'content',
            image: '',
            categories: [
              {
                id: 1,
                name: 'category 1',
              },
            ],
          },
          {
            id: 3,
            title: 'article 3',
            announce: 'announce',
            content: '',
            image: '',
            categories: [],
          },
        ]);
      });

      afterAll(async () => {
        await resetDataset({ articlesRepository, categoriesRepository });
      });
    });
  });

  describe('invalid cases', () => {
    beforeAll(async () => {
      await populateDataset({ articlesRepository, categoriesRepository });
    });

    describe('non existent article', () => {
      it('should return 404', async () => {
        const response = await request(server).delete('/articles/4');
        expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
      });

      it('should not affect result returned by /articles (GET)', async () => {
        const response = await request(server).get('/articles');
        expect(response.body).toEqual([
          {
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
          },
          {
            id: 2,
            title: 'article 2',
            announce: 'announce',
            content: 'content',
            image: '',
            categories: [
              {
                id: 1,
                name: 'category 1',
              },
            ],
          },
          {
            id: 3,
            title: 'article 3',
            announce: 'announce',
            content: '',
            image: '',
            categories: [],
          },
        ]);
      });
    });

    afterAll(async () => {
      await resetDataset({ articlesRepository, categoriesRepository });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
