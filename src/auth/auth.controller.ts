import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUsuarioDto } from '../modules/usuarios/dto/login-usuario.dto';
import { CreateUsuarioDto } from '../modules/usuarios/dto/create-usuario.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUsuarioDto: LoginUsuarioDto) {
    return this.authService.login(loginUsuarioDto);
  }

  @Post('register')
  async register(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.authService.register(createUsuarioDto);
  }

  @Get('check-email/:email')
  async checkEmailExists(@Param('email') email: string) {
    const exists = await this.authService.checkEmailExists(email);
    return { exists };
  }

  @Get('check-cpf/:cpf')
  async checkCPFExists(@Param('cpf') cpf: string) {
    const exists = await this.authService.checkCPFExists(cpf);
    return { exists };
  }

  @Get('check-cnpj/:cnpj')
  async checkCNPJExists(@Param('cnpj') cnpj: string) {
    const exists = await this.authService.checkCNPJExists(cnpj);
    return { exists };
  }
}
