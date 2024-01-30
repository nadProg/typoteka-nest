import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateCommentDto } from './dto/comments.dto';

@Controller('comments')
export class CommentsController {
  @Get()
  async findAll() {
    console.log('Find all comments');
  }

  @Post()
  async create(@Body() createCommentDto: CreateCommentDto) {
    console.log(`Create comment with ${createCommentDto}`);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    console.log(`Delete comment by id = ${id}`);
  }
}
