import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/comments.dto';
import { CommentModel } from './comments.model';

@Injectable()
export class CommentsService {
  async findAll(): Promise<CommentModel[]> {
    return [];
  }

  async findById(id: string): Promise<CommentModel | null> {
    const comments = await this.findAll();

    return comments.find((comment) => comment.id === id) ?? null;
  }

  async create(createCommentDro: CreateCommentDto): Promise<CommentModel> {
    return {
      id: Date.now().toString(),
      content: createCommentDro.content,
    };
  }

  async delete(id: string): Promise<CommentModel | null> {
    return this.findById(id);
  }
}
