import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Body,
  Query,
  HttpStatus,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesService } from '../categories/categories.service';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { FindAllArticlesDto } from './dto/find-all-article.dto';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(
    private articlesService: ArticlesService,
    private categoriesService: CategoriesService,
  ) {}

  @Get()
  async findAll(
    @Query() findAllArticlesParams: FindAllArticlesDto,
  ): Promise<Article[]> {
    return this.articlesService.findAll(findAllArticlesParams);
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Article> {
    const article = await this.articlesService.findById(id);

    if (!article) {
      throw new NotFoundException();
    }

    return article;
  }

  @Post()
  async create(@Body() createArticleDto: CreateArticleDto): Promise<Article> {
    return this.articlesService.create(createArticleDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    const updatedArticle = await this.articlesService.update(
      id,
      updateArticleDto,
    );

    if (!updatedArticle) {
      throw new NotFoundException();
    }

    return updatedArticle;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number): Promise<void> {
    if (!(await this.articlesService.delete(id))) {
      throw new NotFoundException();
    }
  }
}
