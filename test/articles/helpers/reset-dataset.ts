import { Repository } from 'typeorm';
import { resetRepository } from '../../helpers/reset-repository';

export const resetDataset = ({
  articlesRepository,
}: {
  articlesRepository: Repository<any>;
}): Promise<void> => resetRepository(articlesRepository, 'articles');
