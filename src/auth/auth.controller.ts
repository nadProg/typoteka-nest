import { Body, Controller, Post } from '@nestjs/common';
import { SignInDto } from './dto/authDto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post()
  async signIn(@Body() signInDto: SignInDto) {
    console.log(`Sign in user with ${signInDto}`);
    await this.authService.signIn(signInDto);
  }
}
