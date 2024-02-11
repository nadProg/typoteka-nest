import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
  ) {}

  async findAll(): Promise<Comment[]> {
    return this.commentsRepository.find();
  }

  async findById(id: number): Promise<Comment | null> {
    return this.commentsRepository.findOneBy({
      id,
    });
  }

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentsRepository.create(createCommentDto);

    return this.commentsRepository.save(comment);
  }

  async delete(id: number): Promise<boolean> {
    return !!(await this.commentsRepository.delete(id)).affected;
  }
}
