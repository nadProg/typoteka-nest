import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Body,
  Query,
} from '@nestjs/common';
import {
  CreateArticleDto,
  FindAllArticlesParams,
  UpdateArticleDto,
} from './dto/articles.dto';

@Controller('articles')
export class ArticlesController {
  @Get()
  async findAll(@Query() findAllArticlesParams: FindAllArticlesParams) {
    console.log(`Find all articles with ${findAllArticlesParams}`);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    console.log(`Find article by id = ${id}`);
  }

  @Post()
  async create(@Body() createArticleDto: CreateArticleDto) {
    console.log(`Create article with ${createArticleDto}`);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    console.log(`Update article by id = ${id} with ${updateArticleDto}`);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    console.log(`Delete article by id = ${id}`);
  }
}
