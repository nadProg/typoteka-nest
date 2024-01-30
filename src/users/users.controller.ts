import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    console.log(`Sign up user with ${createUserDto}`);
    await this.usersService.create(createUserDto);
  }
}
