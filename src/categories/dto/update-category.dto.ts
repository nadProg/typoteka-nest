import { IsNotEmpty, Length } from 'class-validator';

export class UpdateCategoryDto {
  @IsNotEmpty()
  @Length(0, 30)
  name: string;
}
