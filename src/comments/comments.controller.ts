import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/comments.dto';
import { CommentsService } from './comments.service';
import { CommentModel } from './comments.model';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}
  @Get()
  async findAll(): Promise<CommentModel[]> {
    console.log('Find all comments');
    return this.commentsService.findAll();
  }

  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentModel> {
    console.log(`Create comment with ${createCommentDto}`);
    return this.commentsService.create(createCommentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    console.log(`Delete comment by id = ${id}`);

    const deletedComment = await this.commentsService.delete(id);

    if (!deletedComment) {
      throw new HttpException(
        `Comment with id = ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
