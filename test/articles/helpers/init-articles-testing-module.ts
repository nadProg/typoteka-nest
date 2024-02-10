import { Repository } from 'typeorm';
import { App } from 'supertest/types';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { getArticlesRepository } from '../../helpers/get-articles-repository';

import { Article } from '../../../src/articles/entities/article.entity';
import { ArticlesModule } from '../../../src/articles/articles.module';
import { GlobalValidationPipe } from '../../../src/global/validation.pipe';
import { TypeormTestingModule } from '../../../src/typeorm/typeorm-testing.module';

type InitCategoriesTestingModuleReturn = {
  app: INestApplication;
  server: App;
  articlesRepository: Repository<Article>;
};

export const initArticlesTestingModule =
  async (): Promise<InitCategoriesTestingModuleReturn> => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ArticlesModule, TypeormTestingModule],
    }).compile();

    const app = moduleFixture.createNestApplication();

    app.useGlobalPipes(GlobalValidationPipe);

    await app.init();

    const server = app.getHttpServer();

    const articlesRepository = getArticlesRepository(app);

    return {
      app,
      server,
      articlesRepository,
    };
  };
