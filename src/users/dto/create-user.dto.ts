import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(1, 255)
  firstName: string;

  @IsNotEmpty()
  @Length(1, 255)
  lastName: string;

  @IsNotEmpty()
  @Length(1, 255)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6, 255)
  password: string;

  @IsOptional()
  @MaxLength(255)
  avatar?: string;
}
