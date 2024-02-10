import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
