import { CreateCommentDto } from '../../../src/comments/dto/create-comment.dto';

export const mockCreateCommentDtos: CreateCommentDto[] = [
  {
    content: 'comment 1',
    articleId: 1,
  },
  {
    content: 'comment 2',
    articleId: 2,
  },
];
