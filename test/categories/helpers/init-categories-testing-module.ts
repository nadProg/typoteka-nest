import { Repository } from 'typeorm';
import { App } from 'supertest/types';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { getCategoriesRepository } from '../../helpers/get-categories-repository';

import { Category } from '../../../src/categories/entities/category';
import { CategoriesModule } from '../../../src/categories/categories.module';
import { GlobalValidationPipe } from '../../../src/global/validation.pipe';
import { TypeormTestingModule } from '../../../src/typeorm/typeorm-testing.module';

type InitCategoriesTestingModuleReturn = {
  app: INestApplication;
  server: App;
  categoriesRepository: Repository<Category>;
};

export const initCategoriesTestingModule =
  async (): Promise<InitCategoriesTestingModuleReturn> => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CategoriesModule, TypeormTestingModule],
    }).compile();

    const app = moduleFixture.createNestApplication();

    app.useGlobalPipes(GlobalValidationPipe);

    await app.init();

    const server = app.getHttpServer();

    const categoriesRepository = getCategoriesRepository(app);

    return {
      app,
      server,
      categoriesRepository,
    };
  };
