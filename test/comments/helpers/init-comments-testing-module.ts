import { Repository } from 'typeorm';
import { App } from 'supertest/types';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { getArticlesRepository } from '../../helpers/get-articles-repository';
import { getCommentsRepository } from '../../helpers/get-comments-repository';

import { Comment } from '../../../src/comments/entities/comment.entity';
import { Article } from '../../../src/articles/entities/article.entity';
import { CommentsModule } from '../../../src/comments/comments.module';
import { ArticlesModule } from '../../../src/articles/articles.module';
import { GlobalValidationPipe } from '../../../src/global/validation.pipe';
import { TypeormTestingModule } from '../../../src/typeorm/typeorm-testing.module';

type InitCategoriesTestingModuleReturn = {
  app: INestApplication;
  server: App;
  articlesRepository: Repository<Article>;
  commentsRepository: Repository<Comment>;
};

export const initCommentsTestingModule =
  async (): Promise<InitCategoriesTestingModuleReturn> => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CommentsModule, ArticlesModule, TypeormTestingModule],
    }).compile();

    const app = moduleFixture.createNestApplication();

    app.useGlobalPipes(GlobalValidationPipe);

    await app.init();

    const server = app.getHttpServer();

    const articlesRepository = getArticlesRepository(app);

    const commentsRepository = getCommentsRepository(app);

    return {
      app,
      server,
      commentsRepository,
      articlesRepository,
    };
  };
