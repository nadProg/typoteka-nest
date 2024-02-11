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

  describe('/articles/:id (PUT)', () => {
    describe('valid cases', () => {
      beforeAll(async () => {
        await populateDataset({ articlesRepository, categoriesRepository });
      });

      it('should update article with required fields only', async () => {
        const response = await request(server).put('/articles/1').send({
          title: 'updated article',
          announce: 'updated announce',
          content: '',
          image: '',
          categories: [],
        });

        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body).toEqual({
          id: 1,
          title: 'updated article',
          announce: 'updated announce',
          content: '',
          image: '',
          categories: [],
        });
      });

      it('should update article', async () => {
        const response = await request(server)
          .put('/articles/2')
          .send({
            title: 'updated article',
            announce: 'updated announce',
            content: 'updated content',
            image: 'updated image',
            categories: [2],
          });

        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body).toEqual({
          id: 2,
          title: 'updated article',
          announce: 'updated announce',
          content: 'updated content',
          image: 'updated image',
          categories: [{ id: 2, name: 'category 2' }],
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
            categories: [1, 2, 3, 4, 5],
          });

        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body).toEqual({
          id: 3,
          title: new Array(250).fill('а').join(''),
          announce: new Array(250).fill('а').join(''),
          content: new Array(1000).fill('а').join(''),
          image: new Array(50).fill('а').join(''),
          categories: [
            { id: 1, name: 'category 1' },
            { id: 2, name: 'category 2' },
            { id: 3, name: 'category 3' },
            { id: 4, name: 'category 4' },
            { id: 5, name: 'category 5' },
          ],
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
            categories: [{ id: 2, name: 'category 2' }],
          },
          {
            id: 3,
            title: new Array(250).fill('а').join(''),
            announce: new Array(250).fill('а').join(''),
            content: new Array(1000).fill('а').join(''),
            image: new Array(50).fill('а').join(''),
            categories: [
              { id: 1, name: 'category 1' },
              { id: 2, name: 'category 2' },
              { id: 3, name: 'category 3' },
              { id: 4, name: 'category 4' },
              { id: 5, name: 'category 5' },
            ],
          },
        ]);
      });

      afterAll(async () => {
        await resetDataset({ articlesRepository, categoriesRepository });
      });
    });

    describe('invalid cases', () => {
      beforeAll(async () => {
        await populateDataset({ articlesRepository, categoriesRepository });
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

      describe('no title', () => {
        it('should return 400', async () => {
          const response = await request(server).put('/articles/1').send({
            announce: 'announce',
            image: 'image',
            content: 'content',
            categories: [],
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

      describe('no announce', () => {
        it('should return 400', async () => {
          const response = await request(server).put('/articles/1').send({
            title: 'title',
            image: 'image',
            content: 'content',
            categories: [],
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

      describe('no image', () => {
        it('should return 400', async () => {
          const response = await request(server).put('/articles/1').send({
            title: 'title',
            announce: 'announce',
            content: 'content',
            categories: [],
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

      describe('no content', () => {
        it('should return 400', async () => {
          const response = await request(server).put('/articles/1').send({
            title: 'title',
            announce: 'announce',
            image: 'image',
            categories: [],
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

      describe('no categories', () => {
        it('should return 400', async () => {
          const response = await request(server).put('/articles/1').send({
            title: 'title',
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

      describe.skip('invalid category', () => {
        it('should return 400', async () => {
          const response = await request(server)
            .put('/articles/1')
            .send({
              title: 'title',
              announce: 'announce',
              image: 'image',
              content: 'content',
              categories: [99],
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
  });

  afterAll(async () => {
    await app.close();
  });
});
