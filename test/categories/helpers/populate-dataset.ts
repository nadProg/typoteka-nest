import { Repository } from 'typeorm';
import { Category } from '../../../src/categories/entities/category.entity';
import { mockCreateCategoryDtos } from './mock-create-category-dtos';

export const populateDataset = async ({
  categoriesRepository,
}: {
  categoriesRepository: Repository<Category>;
}): Promise<void> => {
  await categoriesRepository.save(mockCreateCategoryDtos);
};
