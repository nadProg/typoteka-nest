import { Repository } from 'typeorm';
import { Article } from '../../../src/articles/entities/article.entity';
import { mockCreateArticleDtos } from './mock-create-article-dtos';

export const populateDataset = async ({
  articlesRepository,
}: {
  articlesRepository: Repository<Article>;
}): Promise<void> => {
  await articlesRepository.save(mockCreateArticleDtos);
};
