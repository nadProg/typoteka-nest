import { Repository } from 'typeorm';
import { resetRepository } from '../../helpers/reset-repository';

export const resetDataset = async ({
  articlesRepository,
  categoriesRepository,
}: {
  articlesRepository: Repository<any>;
  categoriesRepository: Repository<any>;
}): Promise<void> => {
  await resetRepository(articlesRepository, 'articles');
  await resetRepository(categoriesRepository, 'categories');
};
