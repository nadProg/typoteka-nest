import { Repository } from 'typeorm';
import { App } from 'supertest/types';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { getCommentsRepository } from '../../helpers/get-comments-repository';

import { Comment } from '../../../src/comments/entities/comment.entity';
import { CommentsModule } from '../../../src/comments/comments.module';
import { GlobalValidationPipe } from '../../../src/global/validation.pipe';
import { TypeormTestingModule } from '../../../src/typeorm/typeorm-testing.module';

type InitCategoriesTestingModuleReturn = {
  app: INestApplication;
  server: App;
  commentsRepository: Repository<Comment>;
};

export const initCommentsTestingModule =
  async (): Promise<InitCategoriesTestingModuleReturn> => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CommentsModule, TypeormTestingModule],
    }).compile();

    const app = moduleFixture.createNestApplication();

    app.useGlobalPipes(GlobalValidationPipe);

    await app.init();

    const server = app.getHttpServer();

    const commentsRepository = getCommentsRepository(app);

    return {
      app,
      server,
      commentsRepository,
    };
  };
