import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/users.dto';

@Controller('users')
export class UsersController {
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    console.log(`Sign up user with ${createUserDto}`);
  }
}
