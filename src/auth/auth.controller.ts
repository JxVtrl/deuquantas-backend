import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUsuarioDto } from '../modules/usuarios/dto/login-usuario.dto';
import { CreateUsuarioClienteDto } from '../modules/usuarios/dto/create-usuario.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUsuarioDto: LoginUsuarioDto) {
    return this.authService.login(loginUsuarioDto);
  }

  @Post('register')
  async register(@Body() createUsuarioClienteDto: CreateUsuarioClienteDto) {
    return this.authService.register(createUsuarioClienteDto);
  }

  @Get('check-email/:email')
  async checkEmailExists(@Param('email') email: string) {
    const exists = await this.authService.checkEmailExists(email);
    return { exists };
  }

  @Get('check-cpf/:numCpf')
  async checkCPFExists(@Param('numCpf') numCpf: string) {
    const exists = await this.authService.checkCPFExists(numCpf);
    return { exists };
  }

  @Get('check-cnpj/:numCnpj')
  async checkCNPJExists(@Param('numCnpj') numCnpj: string) {
    const exists = await this.authService.checkCNPJExists(numCnpj);
    return { exists };
  }
}
