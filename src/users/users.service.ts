import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'passwordHash' | 'isAdmin'>> {
    const user = this.usersRepository.create({
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      passwordHash: createUserDto.password, // todo: add hash,
      avatar: createUserDto.avatar,
    });

    const createdUser = await this.usersRepository.save(user);

    return {
      id: createdUser.id,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      email: createdUser.email,
      avatar: createdUser.avatar,
    };
  }

  async isEmailUnique(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    return !user;
  }
}
