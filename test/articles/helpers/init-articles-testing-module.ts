import { Repository } from 'typeorm';
import { App } from 'supertest/types';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { getArticlesRepository } from '../../helpers/get-articles-repository';
import { getCategoriesRepository } from '../../helpers/get-categories-repository';

import { Article } from '../../../src/articles/entities/article.entity';
import { Category } from '../../../src/categories/entities/category.entity';
import { ArticlesModule } from '../../../src/articles/articles.module';
import { GlobalValidationPipe } from '../../../src/global/validation.pipe';
import { TypeormTestingModule } from '../../../src/typeorm/typeorm-testing.module';

type InitArticlesTestingModuleReturn = {
  app: INestApplication;
  server: App;
  articlesRepository: Repository<Article>;
  categoriesRepository: Repository<Category>;
};

export const initArticlesTestingModule =
  async (): Promise<InitArticlesTestingModuleReturn> => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ArticlesModule, TypeormTestingModule],
    }).compile();

    const app = moduleFixture.createNestApplication();

    app.useGlobalPipes(GlobalValidationPipe);

    await app.init();

    const server = app.getHttpServer();

    const articlesRepository = getArticlesRepository(app);

    const categoriesRepository = getCategoriesRepository(app);

    return {
      app,
      server,
      articlesRepository,
      categoriesRepository,
    };
  };
