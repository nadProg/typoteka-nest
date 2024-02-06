import { Repository } from 'typeorm';
import { resetRepository } from '../../helpers/reset-repository';

export const resetDataset = ({
  categoriesRepository,
}: {
  categoriesRepository: Repository<any>;
}): Promise<void> => resetRepository(categoriesRepository, 'categories');
