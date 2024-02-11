import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from '../../articles/entities/article.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 30,
  })
  name: string;

  @ManyToMany(() => Article, (article) => article.categories)
  articles: Article[];
}
