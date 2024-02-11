import { Repository } from 'typeorm';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import * as request from 'supertest';

import { Comment } from '../../src/comments/entities/comment.entity';
import { Article } from '../../src/articles/entities/article.entity';

import { resetDataset } from './helpers/reset-dataset';
import { populateDataset } from './helpers/populate-dataset';
import { initCommentsTestingModule } from './helpers/init-comments-testing-module';

describe('Comments module (e2e)', () => {
  let app: INestApplication;
  let server: App;
  let commentsRepository: Repository<Comment>;
  let articlesRepository: Repository<Article>;

  beforeAll(async () => {
    ({ app, server, commentsRepository, articlesRepository } =
      await initCommentsTestingModule());
  });

  describe('/comments (POST)', () => {
    describe('valid cases', () => {
      beforeAll(async () => {
        await populateDataset({ commentsRepository, articlesRepository });
      });

      it('should create comment', async () => {
        const response = await request(server).post('/comments').send({
          content: 'created comment',
          articleId: 1,
        });

        expect(response.statusCode).toBe(HttpStatus.CREATED);
        expect(response.body).toEqual({
          id: 3,
          content: 'created comment',
          articleId: 1,
        });
      });

      it('should create comment with max available text fields length', async () => {
        const response = await request(server)
          .post('/comments')
          .send({
            content: new Array(30).fill('а').join(''),
            articleId: 1,
          });

        expect(response.statusCode).toBe(HttpStatus.CREATED);
        expect(response.body).toEqual({
          id: 4,
          content: new Array(30).fill('а').join(''),
          articleId: 1,
        });
      });

      it('created comments should be returned by /comments (GET)', async () => {
        const response = await request(server).get('/comments');

        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body).toEqual([
          {
            id: 1,
            content: 'comment 1',
            articleId: 1,
          },
          {
            id: 2,
            content: 'comment 2',
            articleId: 2,
          },
          {
            id: 3,
            content: 'created comment',
            articleId: 1,
          },
          {
            id: 4,
            content: new Array(30).fill('а').join(''),
            articleId: 1,
          },
        ]);
      });

      afterAll(async () => {
        await resetDataset({ commentsRepository });
      });
    });

    describe('invalid cases', () => {
      beforeAll(async () => {
        await populateDataset({ commentsRepository, articlesRepository });
      });

      describe('no body', () => {
        it('should return 400', async () => {
          const response = await request(server).post('/comments');

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('no created comments should be returned by /comments (GET)', async () => {
          const response = await request(server).get('/comments');

          expect(response.statusCode).toBe(HttpStatus.OK);
          expect(response.body).toEqual([
            {
              id: 1,
              content: 'comment 1',
              articleId: 1,
            },
            {
              id: 2,
              content: 'comment 2',
              articleId: 2,
            },
          ]);
        });
      });

      describe('empty body', () => {
        it('should return 400', async () => {
          const response = await request(server).post('/comments').send({});

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('no created comments should be returned by /comments (GET)', async () => {
          const response = await request(server).get('/comments');

          expect(response.body).toEqual([
            {
              id: 1,
              content: 'comment 1',
              articleId: 1,
            },
            {
              id: 2,
              content: 'comment 2',
              articleId: 2,
            },
          ]);
        });
      });

      describe('no articleId', () => {
        it('should return 400', async () => {
          const response = await request(server).post('/comments').send({
            content: 'created comment',
          });

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('no created comments should be returned by /comments (GET)', async () => {
          const response = await request(server).get('/comments');

          expect(response.body).toEqual([
            {
              id: 1,
              content: 'comment 1',
              articleId: 1,
            },
            {
              id: 2,
              content: 'comment 2',
              articleId: 2,
            },
          ]);
        });
      });

      describe('content with length > 30', () => {
        it('should return 400', async () => {
          const response = await request(server)
            .post('/comments')
            .send({
              content: new Array(31).fill('t').join(''),
            });

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('no created comments should be returned by /comments (GET)', async () => {
          const response = await request(server).get('/comments');

          expect(response.statusCode).toBe(HttpStatus.OK);
          expect(response.body).toEqual([
            {
              id: 1,
              content: 'comment 1',
              articleId: 1,
            },
            {
              id: 2,
              content: 'comment 2',
              articleId: 2,
            },
          ]);
        });
      });

      describe('non-existent article', () => {
        it('should return 400', async () => {
          const response = await request(server).post('/comments').send({
            content: 'created article',
            articleId: 99,
          });

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('no created comments should be returned by /comments (GET)', async () => {
          const response = await request(server).get('/comments');

          expect(response.statusCode).toBe(HttpStatus.OK);
          expect(response.body).toEqual([
            {
              id: 1,
              content: 'comment 1',
              articleId: 1,
            },
            {
              id: 2,
              content: 'comment 2',
              articleId: 2,
            },
          ]);
        });
      });

      afterAll(async () => {
        await resetDataset({ commentsRepository });
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
