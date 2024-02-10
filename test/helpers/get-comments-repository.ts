import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';
import { Comment } from '../../src/comments/entities/comment.entity';

export const getCommentsRepository = (
  app: INestApplication,
): Repository<Comment> => {
  return app.get<Repository<Comment>>(getRepositoryToken(Comment));
};
