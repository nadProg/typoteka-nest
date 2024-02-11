import { Repository } from 'typeorm';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import * as request from 'supertest';

import { Article } from '../../src/articles/entities/article.entity';
import { Comment } from '../../src/comments/entities/comment.entity';

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

  describe('/comments (DELETE)', () => {
    describe('valid cases', () => {
      beforeAll(async () => {
        await populateDataset({ commentsRepository, articlesRepository });
      });

      it('should return 204', async () => {
        const response = await request(server).delete('/comments/1');
        expect(response.statusCode).toBe(HttpStatus.NO_CONTENT);
        expect(response.body).toEqual({});
      });

      it('deleted comment should not be returned by /comments (GET)', async () => {
        const response = await request(server).get('/comments');
        expect(response.body).toEqual([
          {
            id: 2,
            content: 'comment 2',
            articleId: 2,
          },
        ]);
      });

      afterAll(async () => {
        await resetDataset({ commentsRepository });
      });
    });
  });

  describe('invalid cases', () => {
    beforeAll(async () => {
      await populateDataset({ commentsRepository, articlesRepository });
    });

    describe('non existent comment', () => {
      it('should return 404', async () => {
        const response = await request(server).delete('/comments/3');
        expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
      });

      it('should not affect result returned by /comments (GET)', async () => {
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

    afterAll(async () => {
      await resetDataset({ commentsRepository });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
