import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';
import { User } from '../../src/users/entities/user.entity';

export const getUsersRepository = (app: INestApplication): Repository<User> => {
  return app.get<Repository<User>>(getRepositoryToken(User));
};
