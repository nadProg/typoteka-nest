import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { FindAllArticlesDto } from './dto/find-all-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article) private articlesRepository: Repository<Article>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll(findAllArticlesDto: FindAllArticlesDto): Promise<Article[]> {
    return this.articlesRepository.find({
      select: {
        categories: {
          name: true,
        },
      },
    });
  }

  async findById(id: number): Promise<Article | null> {
    return await this.articlesRepository.findOneBy({
      id,
    });
  }

  async create({
    categories: categoriesIds,
    ...restCreateArticleDto
  }: CreateArticleDto): Promise<Article> {
    const article = this.articlesRepository.create(restCreateArticleDto);

    const articleCategories = await this.categoriesRepository.findBy({
      id: In(categoriesIds),
    });

    return this.articlesRepository.save({
      ...article,
      categories: articleCategories,
    });
  }

  async update(
    id: number,
    { categories: categoriesIds, ...restUpdateArticleDto }: UpdateArticleDto,
  ): Promise<Article | null> {
    const article = await this.articlesRepository.preload({ id });

    if (!article) {
      return null;
    }

    const articleCategories = await this.categoriesRepository.findBy({
      id: In(categoriesIds),
    });

    return this.articlesRepository.save({
      ...article,
      ...restUpdateArticleDto,
      categories: articleCategories,
    });
  }

  async delete(id: number): Promise<boolean> {
    return !!(await this.articlesRepository.delete(id)).affected;
  }
}
