import { Repository } from 'typeorm';
import { Comment } from '../../../src/comments/entities/comment.entity';
import { mockCreateCommentDtos } from './mock-create-comment-dtos';

export const populateDataset = async ({
  commentsRepository,
}: {
  commentsRepository: Repository<Comment>;
}): Promise<void> => {
  await commentsRepository.save(mockCreateCommentDtos);
};
