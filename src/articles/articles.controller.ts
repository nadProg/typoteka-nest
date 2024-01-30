import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Body,
  Query,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  CreateArticleDto,
  FindAllArticlesParams,
  UpdateArticleDto,
} from './dto/articles.dto';
import { ArticleModel } from './articles.model';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @Get()
  async findAll(
    @Query() findAllArticlesParams: FindAllArticlesParams,
  ): Promise<ArticleModel[]> {
    console.log(`Find all articles with ${findAllArticlesParams}`);
    return this.articlesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ArticleModel> {
    console.log(`Find article by id = ${id}`);
    const article = await this.articlesService.findById(id);

    if (!article) {
      throw new HttpException(
        `Article with id = ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return article;
  }

  @Post()
  async create(
    @Body() createArticleDto: CreateArticleDto,
  ): Promise<ArticleModel> {
    console.log(`Create article with ${createArticleDto}`);
    return this.articlesService.create(createArticleDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleModel> {
    console.log(`Update article by id = ${id} with ${updateArticleDto}`);
    const updatedArticle = await this.articlesService.update(
      id,
      updateArticleDto,
    );

    if (!updatedArticle) {
      throw new HttpException(
        `Article with id = ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return updatedArticle;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    console.log(`Delete article by id = ${id}`);
    const deletedArticle = await this.articlesService.delete(id);

    if (!deletedArticle) {
      throw new HttpException(
        `Article with id = ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
