import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';
import { Article } from '../../src/articles/entities/article.entity';

export const getArticlesRepository = (
  app: INestApplication,
): Repository<Article> => {
  return app.get<Repository<Article>>(getRepositoryToken(Article));
};
