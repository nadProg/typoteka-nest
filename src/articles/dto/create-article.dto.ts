import { IsNotEmpty, IsNumber, IsOptional, MaxLength } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty()
  @MaxLength(250)
  title: string;

  @IsNotEmpty()
  @MaxLength(250)
  announce: string;

  @IsNotEmpty()
  @IsNumber({}, { each: true })
  categories: number[];

  @IsOptional()
  @MaxLength(1000)
  content?: string;

  @IsOptional()
  @MaxLength(50)
  image?: string;
}
