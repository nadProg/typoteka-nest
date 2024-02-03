import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
  })
  announce: string;

  @Column({
    type: 'varchar',
    length: 1000,
  })
  content: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  image: string;
}
