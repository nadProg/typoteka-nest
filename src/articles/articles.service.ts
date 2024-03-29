import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { FindAllArticlesDto } from './dto/find-all-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article) private articlesRepository: Repository<Article>,
  ) {}

  async findAll(findAllArticlesDto: FindAllArticlesDto): Promise<Article[]> {
    return this.articlesRepository.find();
  }

  async findById(id: number): Promise<Article | null> {
    return await this.articlesRepository.findOne({
      where: {
        id,
      },
    });
  }

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const article = this.articlesRepository.create(createArticleDto);

    return this.articlesRepository.save(article);
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article | null> {
    const article = await this.articlesRepository.preload({ id });

    if (!article) {
      return null;
    }

    return (
      (await this.articlesRepository.save({
        ...article,
        ...updateArticleDto,
      })) ?? null
    );
  }

  async delete(id: number): Promise<boolean> {
    return !!(await this.articlesRepository.delete(id)).affected;
  }
}
