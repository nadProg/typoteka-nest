import { IsNotEmpty, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @Length(0, 30)
  name: string;
}
