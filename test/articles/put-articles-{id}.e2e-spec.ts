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

  describe('/articles/:id (PUT)', () => {
    describe('valid cases', () => {
      beforeAll(async () => {
        await populateDataset({ articlesRepository });
      });

      it('should update article with required fields only', async () => {
        const response = await request(server).put('/articles/1').send({
          title: 'updated article',
          announce: 'updated announce',
          content: '',
          image: '',
        });

        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body).toEqual({
          id: 1,
          title: 'updated article',
          announce: 'updated announce',
          content: '',
          image: '',
        });
      });

      it('should update article', async () => {
        const response = await request(server).put('/articles/2').send({
          title: 'updated article',
          announce: 'updated announce',
          content: 'updated content',
          image: 'updated image',
        });

        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body).toEqual({
          id: 2,
          title: 'updated article',
          announce: 'updated announce',
          content: 'updated content',
          image: 'updated image',
        });
      });

      it('should create article with max available text fields length', async () => {
        const response = await request(server)
          .put('/articles/3')
          .send({
            title: new Array(250).fill('а').join(''),
            announce: new Array(250).fill('а').join(''),
            content: new Array(1000).fill('а').join(''),
            image: new Array(50).fill('а').join(''),
          });

        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body).toEqual({
          id: 3,
          title: new Array(250).fill('а').join(''),
          announce: new Array(250).fill('а').join(''),
          content: new Array(1000).fill('а').join(''),
          image: new Array(50).fill('а').join(''),
        });
      });

      it('updated articles should be returned by /articles (GET)', async () => {
        const response = await request(server).get('/articles');

        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body).toEqual([
          {
            id: 1,
            title: 'updated article',
            announce: 'updated announce',
            content: '',
            image: '',
            categories: [],
          },
          {
            id: 2,
            title: 'updated article',
            announce: 'updated announce',
            content: 'updated content',
            image: 'updated image',
            categories: [],
          },
          {
            id: 3,
            title: new Array(250).fill('а').join(''),
            announce: new Array(250).fill('а').join(''),
            content: new Array(1000).fill('а').join(''),
            image: new Array(50).fill('а').join(''),
            categories: [],
          },
        ]);
      });

      afterAll(async () => {
        await resetDataset({ articlesRepository });
      });
    });

    describe('invalid cases', () => {
      beforeAll(async () => {
        await populateDataset({ articlesRepository });
      });

      describe('no body', () => {
        it('should return 400', async () => {
          const response = await request(server).put('/articles/1');

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('no updated articles should be returned by /articles (GET)', async () => {
          const response = await request(server).get('/articles');

          expect(response.statusCode).toBe(HttpStatus.OK);
          expect(response.body).toEqual([
            {
              id: 1,
              title: 'article 1',
              announce: 'announce',
              content: 'content',
              image: 'image',
              categories: [],
            },
            {
              id: 2,
              title: 'article 2',
              announce: 'announce',
              content: 'content',
              image: '',
              categories: [],
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

      describe('empty body', () => {
        it('should return 400', async () => {
          const response = await request(server).put('/articles/1').send({});

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('no updated articles should be returned by /articles (GET)', async () => {
          const response = await request(server).get('/articles');

          expect(response.body).toEqual([
            {
              id: 1,
              title: 'article 1',
              announce: 'announce',
              content: 'content',
              image: 'image',
              categories: [],
            },
            {
              id: 2,
              title: 'article 2',
              announce: 'announce',
              content: 'content',
              image: '',
              categories: [],
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

      describe('no title', () => {
        it('should return 400', async () => {
          const response = await request(server).put('/articles/1').send({
            announce: 'announce',
            image: 'image',
            content: 'content',
          });

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('no updated articles should be returned by /articles (GET)', async () => {
          const response = await request(server).get('/articles');

          expect(response.statusCode).toBe(HttpStatus.OK);
          expect(response.body).toEqual([
            {
              id: 1,
              title: 'article 1',
              announce: 'announce',
              content: 'content',
              image: 'image',
              categories: [],
            },
            {
              id: 2,
              title: 'article 2',
              announce: 'announce',
              content: 'content',
              image: '',
              categories: [],
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

      describe('no announce', () => {
        it('should return 400', async () => {
          const response = await request(server).put('/articles/1').send({
            title: 'title',
            image: 'image',
            content: 'content',
          });

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('no updated articles should be returned by /articles (GET)', async () => {
          const response = await request(server).get('/articles');

          expect(response.statusCode).toBe(HttpStatus.OK);
          expect(response.body).toEqual([
            {
              id: 1,
              title: 'article 1',
              announce: 'announce',
              content: 'content',
              image: 'image',
              categories: [],
            },
            {
              id: 2,
              title: 'article 2',
              announce: 'announce',
              content: 'content',
              image: '',
              categories: [],
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

      describe('no image', () => {
        it('should return 400', async () => {
          const response = await request(server).put('/articles/1').send({
            title: 'title',
            announce: 'announce',
            content: 'content',
          });

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('no updated articles should be returned by /articles (GET)', async () => {
          const response = await request(server).get('/articles');

          expect(response.statusCode).toBe(HttpStatus.OK);
          expect(response.body).toEqual([
            {
              id: 1,
              title: 'article 1',
              announce: 'announce',
              content: 'content',
              image: 'image',
              categories: [],
            },
            {
              id: 2,
              title: 'article 2',
              announce: 'announce',
              content: 'content',
              image: '',
              categories: [],
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

      describe('np content', () => {
        it('should return 400', async () => {
          const response = await request(server).put('/articles/1').send({
            title: 'title',
            announce: 'announce',
            image: 'image',
          });

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('no updated articles should be returned by /articles (GET)', async () => {
          const response = await request(server).get('/articles');

          expect(response.statusCode).toBe(HttpStatus.OK);
          expect(response.body).toEqual([
            {
              id: 1,
              title: 'article 1',
              announce: 'announce',
              content: 'content',
              image: 'image',
              categories: [],
            },
            {
              id: 2,
              title: 'article 2',
              announce: 'announce',
              content: 'content',
              image: '',
              categories: [],
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

      describe('title with length > 250', () => {
        it('should return 400', async () => {
          const response = await request(server)
            .put('/articles/1')
            .send({
              title: new Array(251).fill('t').join(''),
              announce: 'announce',
              image: 'image',
              content: 'content',
            });

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('no updated articles should be returned by /articles (GET)', async () => {
          const response = await request(server).get('/articles');

          expect(response.statusCode).toBe(HttpStatus.OK);
          expect(response.body).toEqual([
            {
              id: 1,
              title: 'article 1',
              announce: 'announce',
              content: 'content',
              image: 'image',
              categories: [],
            },
            {
              id: 2,
              title: 'article 2',
              announce: 'announce',
              content: 'content',
              image: '',
              categories: [],
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

      describe('announce with length > 250', () => {
        it('should return 400', async () => {
          const response = await request(server)
            .put('/articles/1')
            .send({
              title: 'title',
              announce: new Array(251).fill('t').join(''),
              image: 'image',
              content: 'content',
            });

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('no updated articles should be returned by /articles (GET)', async () => {
          const response = await request(server).get('/articles');

          expect(response.statusCode).toBe(HttpStatus.OK);
          expect(response.body).toEqual([
            {
              id: 1,
              title: 'article 1',
              announce: 'announce',
              content: 'content',
              image: 'image',
              categories: [],
            },
            {
              id: 2,
              title: 'article 2',
              announce: 'announce',
              content: 'content',
              image: '',
              categories: [],
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

      describe('content with length > 1000', () => {
        it('should return 400', async () => {
          const response = await request(server)
            .put('/articles/1')
            .send({
              title: 'title',
              announce: 'announce',
              image: 'image',
              content: new Array(1001).fill('t').join(''),
            });

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('no updated articles should be returned by /articles (GET)', async () => {
          const response = await request(server).get('/articles');

          expect(response.statusCode).toBe(HttpStatus.OK);
          expect(response.body).toEqual([
            {
              id: 1,
              title: 'article 1',
              announce: 'announce',
              content: 'content',
              image: 'image',
              categories: [],
            },
            {
              id: 2,
              title: 'article 2',
              announce: 'announce',
              content: 'content',
              image: '',
              categories: [],
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

      describe('image with length > 50', () => {
        it('should return 400', async () => {
          const response = await request(server)
            .put('/articles/1')
            .send({
              title: 'title',
              announce: 'announce',
              image: new Array(51).fill('t').join(''),
              content: 'content',
            });

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('no updated articles should be returned by /articles (GET)', async () => {
          const response = await request(server).get('/articles');

          expect(response.statusCode).toBe(HttpStatus.OK);
          expect(response.body).toEqual([
            {
              id: 1,
              title: 'article 1',
              announce: 'announce',
              content: 'content',
              image: 'image',
              categories: [],
            },
            {
              id: 2,
              title: 'article 2',
              announce: 'announce',
              content: 'content',
              image: '',
              categories: [],
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
        await resetDataset({ articlesRepository });
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
