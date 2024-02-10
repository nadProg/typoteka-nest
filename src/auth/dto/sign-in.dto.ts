import { IsNotEmpty, Length } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @Length(1, 255)
  email: string;

  @IsNotEmpty()
  @Length(1, 255)
  password: string;
}
