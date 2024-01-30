import { Injectable } from '@nestjs/common';
import { SignInDto } from './dto/authDto';
import { AuthToken } from './auth.model';

@Injectable()
export class AuthService {
  async signIn(signInDto: SignInDto): Promise<AuthToken> {
    return {
      userId: Date.now().toString(),
      token: signInDto.email,
    };
  }
}