import { Repository } from 'typeorm';
import { App } from 'supertest/types';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { getUsersRepository } from '../../helpers/get-users-repository';

import { User } from '../../../src/users/entities/user.entity';
import { UsersModule } from '../../../src/users/users.module';
import { GlobalValidationPipe } from '../../../src/global/validation.pipe';
import { TypeormTestingModule } from '../../../src/typeorm/typeorm-testing.module';

type InitUsersTestingModuleReturn = {
  app: INestApplication;
  server: App;
  usersRepository: Repository<User>;
};

export const initUsersTestingModule =
  async (): Promise<InitUsersTestingModuleReturn> => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, TypeormTestingModule],
    }).compile();

    const app = moduleFixture.createNestApplication();

    app.useGlobalPipes(GlobalValidationPipe);

    await app.init();

    const server = app.getHttpServer();

    const usersRepository = getUsersRepository(app);

    return {
      app,
      server,
      usersRepository,
    };
  };
