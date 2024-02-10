import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { User } from '../users/entities/user.entities';
import { Article } from '../articles/entities/article.entity';
import { Comment } from '../comments/entities/comment.entity';

export const TypeormTestingModule = TypeOrmModule.forRoot({
  type: 'better-sqlite3',
  database: ':memory:',
  dropSchema: true,
  entities: [Category, User, Article, Comment],
  synchronize: true,
  logging: false,
});
