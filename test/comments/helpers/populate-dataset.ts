import { Repository } from 'typeorm';
import { Article } from '../../../src/articles/entities/article.entity';
import { Comment } from '../../../src/comments/entities/comment.entity';
import { mockCreateArticleDtos } from './mock-create-article-dtos';
import { mockCreateCommentDtos } from './mock-create-comment-dtos';

export const populateDataset = async ({
  commentsRepository,
  articlesRepository,
}: {
  commentsRepository: Repository<Comment>;
  articlesRepository: Repository<Article>;
}): Promise<void> => {
  for (const createArticleDto of mockCreateArticleDtos) {
    await articlesRepository.save({
      ...createArticleDto,
      categories: [],
    });
  }

  await commentsRepository.save(mockCreateCommentDtos);
};
