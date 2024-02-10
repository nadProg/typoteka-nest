import { Repository } from 'typeorm';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import * as request from 'supertest';

import { Comment } from '../../src/comments/entities/comment.entity';

import { resetDataset } from './helpers/reset-dataset';
import { populateDataset } from './helpers/populate-dataset';
import { initCommentsTestingModule } from './helpers/init-comments-testing-module';

describe('Comments module (e2e)', () => {
  let app: INestApplication;
  let server: App;
  let commentsRepository: Repository<Comment>;

  beforeAll(async () => {
    ({ app, server, commentsRepository } = await initCommentsTestingModule());
  });

  describe('/comments (POST)', () => {
    describe('valid cases', () => {
      beforeAll(async () => {
        await populateDataset({ commentsRepository });
      });

      it('should create comment', async () => {
        const response = await request(server).post('/comments').send({
          content: 'created comment',
        });

        expect(response.statusCode).toBe(HttpStatus.CREATED);
        expect(response.body).toEqual({
          id: 3,
          content: 'created comment',
        });
      });

      it('should create comment with max available text fields length', async () => {
        const response = await request(server)
          .post('/comments')
          .send({
            content: new Array(30).fill('а').join(''),
          });

        expect(response.statusCode).toBe(HttpStatus.CREATED);
        expect(response.body).toEqual({
          id: 4,
          content: new Array(30).fill('а').join(''),
        });
      });

      it('created comments should be returned by /comments (GET)', async () => {
        const response = await request(server).get('/comments');

        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body).toEqual([
          {
            id: 1,
            content: 'comment 1',
          },
          {
            id: 2,
            content: 'comment 2',
          },
          {
            id: 3,
            content: 'created comment',
          },
          {
            id: 4,
            content: new Array(30).fill('а').join(''),
          },
        ]);
      });

      afterAll(async () => {
        await resetDataset({ commentsRepository });
      });
    });

    describe('invalid cases', () => {
      beforeAll(async () => {
        await populateDataset({ commentsRepository });
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
            },
            {
              id: 2,
              content: 'comment 2',
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
            },
            {
              id: 2,
              content: 'comment 2',
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
            },
            {
              id: 2,
              content: 'comment 2',
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
