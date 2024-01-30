import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  @Post()
  async signIn(@Body() authDto: AuthDto) {
    console.log(`Sign in user with ${authDto}`);
  }
}
