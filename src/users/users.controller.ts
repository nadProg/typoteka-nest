import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  async signUp() {
    console.log('Sign up user');
  }

  @Get('auth')
  async signIn() {
    console.log('Sign in user');
  }
}
