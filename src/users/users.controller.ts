import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'passwordHash' | 'isAdmin'>> {
    const isEmailUnique = await this.usersService.isEmailUnique(
      createUserDto.email,
    );

    if (!isEmailUnique) {
      throw new HttpException('Email is busy', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    return this.usersService.create(createUserDto);
  }
}
