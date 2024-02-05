import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalValidationPipe } from './global/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(GlobalValidationPipe);
  await app.listen(3000);
}
bootstrap();
