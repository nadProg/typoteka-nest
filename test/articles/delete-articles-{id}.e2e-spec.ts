import { Repository } from 'typeorm';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import * as request from 'supertest';

import { Article } from '../../src/articles/entities/article.entity';

import { resetDataset } from './helpers/reset-dataset';
import { populateDataset } from './helpers/populate-dataset';
import { initArticlesTestingModule } from './helpers/init-articles-testing-module';

describe('Articles module (e2e)', () => {
  let app: INestApplication;
  let server: App;
  let articlesRepository: Repository<Article>;

  beforeAll(async () => {
    ({ app, server, articlesRepository } = await initArticlesTestingModule());
  });

  describe('/articles (DELETE)', () => {
    describe('valid cases', () => {
      beforeAll(async () => {
        await populateDataset({ articlesRepository });
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
          },
          {
            id: 3,
            title: 'article 3',
            announce: 'announce',
            content: '',
            image: '',
          },
        ]);
      });

      afterAll(async () => {
        await resetDataset({ articlesRepository });
      });
    });
  });

  describe('invalid cases', () => {
    beforeAll(async () => {
      await populateDataset({ articlesRepository });
    });

    describe('non existent category', () => {
      it('should return 404', async () => {
        const response = await request(server).delete('/articles/4');
        expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
      });

      it('should not affect result returned by /categories (GET)', async () => {
        const response = await request(server).get('/articles');
        expect(response.body).toEqual([
          {
            id: 1,
            title: 'article 1',
            announce: 'announce',
            content: 'content',
            image: 'image',
          },
          {
            id: 2,
            title: 'article 2',
            announce: 'announce',
            content: 'content',
            image: '',
          },
          {
            id: 3,
            title: 'article 3',
            announce: 'announce',
            content: '',
            image: '',
          },
        ]);
      });
    });

    afterAll(async () => {
      await resetDataset({ articlesRepository });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
