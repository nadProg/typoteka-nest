import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/users.dto';
import { UserModel } from './users.model';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserModel> {
    console.log(`Sign up user with ${createUserDto}`);
    return this.usersService.create(createUserDto);
  }
}
