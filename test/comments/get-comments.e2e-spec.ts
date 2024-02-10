import { HttpStatus, INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import { App } from 'supertest/types';
import * as request from 'supertest';
import { Comment } from '../../src/comments/entities/comment.entity';
import { initCommentsTestingModule } from './helpers/init-comments-testing-module';
import { populateDataset } from './helpers/populate-dataset';
import { resetDataset } from './helpers/reset-dataset';

describe('Comments module (e2e)', () => {
  let app: INestApplication;
  let server: App;
  let commentsRepository: Repository<Comment>;
  let response: request.Response;

  beforeAll(async () => {
    ({ app, server, commentsRepository } = await initCommentsTestingModule());

    await populateDataset({ commentsRepository });
  });

  describe('/comments (GET)', () => {
    beforeAll(async () => {
      response = await request(server).get('/comments');
    });

    it('status code should be 200', () => {
      expect(response.statusCode).toBe(HttpStatus.OK);
    });

    it('should return comments from repository', () => {
      expect(response.body).toEqual([
        { id: 1, content: 'comment 1' },
        { id: 2, content: 'comment 2' },
      ]);
    });
  });

  afterAll(() => {
    app.close();
    resetDataset({ commentsRepository });
  });
});
