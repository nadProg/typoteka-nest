import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/users.dto';
import { UserModel } from './users.model';

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto): Promise<UserModel> {
    return {
      id: Date.now().toString(),
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      passwordHash: createUserDto.password,
      createdAt: new Date().toISOString(),
    };
  }
}
