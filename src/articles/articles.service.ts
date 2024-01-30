import { Injectable } from '@nestjs/common';
import { CreateArticleDto, UpdateArticleDto } from './dto/articles.dto';
import { ArticleModel } from './articles.model';

@Injectable()
export class ArticlesService {
  async findAll(): Promise<ArticleModel[]> {
    return [];
  }

  async findById(id: string): Promise<ArticleModel | null> {
    const articles = await this.findAll();

    return articles.find((article) => article.id === id) ?? null;
  }

  async create(createArticleDto: CreateArticleDto): Promise<ArticleModel> {
    return {
      id: Date.now().toString(),
      title: createArticleDto.title,
      content: createArticleDto.content,
      image: createArticleDto.image,
      createdAt: new Date().toString(),
    };
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleModel | null> {
    const article = await this.findById(id);

    if (!article) {
      return null;
    }

    return {
      ...article,
      ...updateArticleDto,
    };
  }

  async delete(id: string): Promise<ArticleModel | null> {
    return this.findById(id);
  }
}
