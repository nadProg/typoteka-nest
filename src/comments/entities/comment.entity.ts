import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Article } from '../../articles/entities/article.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 30,
  })
  content: string;

  @ManyToOne(() => Article, (article) => article.comments, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({
    name: 'articleId',
  })
  article: Article;

  @Column()
  articleId: number;
}
