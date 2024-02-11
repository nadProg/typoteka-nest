import { IsNotEmpty, IsNumber, Length, MaxLength } from 'class-validator';

export class UpdateArticleDto {
  @IsNotEmpty()
  @MaxLength(250)
  title: string;

  @IsNotEmpty()
  @MaxLength(250)
  announce: string;

  @IsNotEmpty()
  @IsNumber({}, { each: true })
  categories: number[];

  @Length(0, 1000)
  content: string;

  @Length(0, 50)
  image?: string;
}
