import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @MaxLength(30)
  content: string;

  @IsNotEmpty()
  articleId: number;
}
