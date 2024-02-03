import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  passwordHash: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  avatar: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  isAdmin: boolean;
}
