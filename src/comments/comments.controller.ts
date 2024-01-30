import { Controller, Delete, Get, Param } from '@nestjs/common';

@Controller('comments')
export class CommentsController {
  @Get()
  async findAll() {
    console.log('Find all comments');
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    console.log(`Delete comment by id = ${id}`);
  }
}
