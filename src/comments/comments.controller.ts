import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  HttpCode,
  Param,
  Post,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ArticlesService } from '../articles/articles.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';

@Controller('comments')
export class CommentsController {
  constructor(
    private commentsService: CommentsService,
    private articlesService: ArticlesService,
  ) {}
  @Get()
  async findAll(): Promise<Comment[]> {
    return this.commentsService.findAll();
  }

  @Post()
  async create(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    const commentArticle = await this.articlesService.findById(
      createCommentDto.articleId,
    );

    if (!commentArticle) {
      throw new BadRequestException(
        `Article(${createCommentDto.articleId}) not found`,
      );
    }

    return this.commentsService.create(createCommentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number): Promise<void> {
    if (!(await this.commentsService.delete(id))) {
      throw new NotFoundException();
    }
  }
}
