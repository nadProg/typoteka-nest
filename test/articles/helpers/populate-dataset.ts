import { In, Repository } from 'typeorm';
import { Article } from '../../../src/articles/entities/article.entity';
import { Category } from '../../../src/categories/entities/category.entity';
import { mockCreateCategoryDtos } from './mock-create-category-dtos';
import { mockCreateArticleDtos } from './mock-create-article-dtos';

export const populateDataset = async ({
  articlesRepository,
  categoriesRepository,
}: {
  articlesRepository: Repository<Article>;
  categoriesRepository: Repository<Category>;
}): Promise<void> => {
  await categoriesRepository.save(mockCreateCategoryDtos);

  for (const createArticleDto of mockCreateArticleDtos) {
    const { categories, ...restCreateArticleDto } = createArticleDto;

    const articleCategories = await categoriesRepository.findBy({
      id: In(categories),
    });

    const article = articlesRepository.create(restCreateArticleDto);

    await articlesRepository.save({
      ...article,
      categories: articleCategories,
    });
  }
};
