import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() { numCpf, password }: { numCpf: string; password: string },
  ) {
    return this.authService.login(numCpf, password);
  }
}
