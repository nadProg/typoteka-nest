import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

@Controller('articles')
export class ArticlesController {
  @Get()
  async findAll() {
    console.log('Find all articles');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    console.log(`Find article by id = ${id}`);
  }

  @Post()
  async create() {
    console.log('Create article');
  }

  @Put(':id')
  async update(@Param('id') id: string) {
    console.log(`Update article by id = ${id}`);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    console.log(`Delete article by id = ${id}`);
  }
}
