import { ValidationPipe } from '@nestjs/common';

export const GlobalValidationPipe = new ValidationPipe({
  transform: true,
});
