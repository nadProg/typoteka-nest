import { Body, Controller, Post } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { AuthToken } from './auth.model';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post()
  async signIn(@Body() signInDto: SignInDto): Promise<AuthToken> {
    console.log(`Sign in user with ${signInDto}`);
    return this.authService.signIn(signInDto);
  }
}
