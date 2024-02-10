import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';
import { Category } from '../../src/categories/entities/category.entity';

export const getCategoriesRepository = (
  app: INestApplication,
): Repository<Category> => {
  return app.get<Repository<Category>>(getRepositoryToken(Category));
};
