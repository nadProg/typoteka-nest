import { App } from 'supertest/types';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthModule } from '../../../src/auth/auth.module';
import { GlobalValidationPipe } from '../../../src/global/validation.pipe';

type InitAuthTestingModuleReturn = {
  app: INestApplication;
  server: App;
};

export const initAuthTestingModule =
  async (): Promise<InitAuthTestingModuleReturn> => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    const app = moduleFixture.createNestApplication();

    app.useGlobalPipes(GlobalValidationPipe);

    await app.init();

    const server = app.getHttpServer();

    return {
      app,
      server,
    };
  };
