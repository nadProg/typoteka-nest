import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from '../../comments/entities/comment.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 250,
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 250,
  })
  announce: string;

  @Column({
    type: 'varchar',
    length: 1000,
    nullable: true,
    default: '',
  })
  content: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    default: '',
  })
  image: string;

  @OneToMany(() => Comment, (comment) => comment.article, {
    eager: false,
  })
  comments: Comment;

  @ManyToMany(() => Category, (category) => category.articles, { eager: true })
  @JoinTable({
    name: 'articles_categories',
    joinColumn: { name: 'articleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
  })
  categories: Category[];
}
