import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUsuarioDto } from '../modules/usuarios/dto/login-usuario.dto';
import { CreateUsuarioClienteDto } from '../modules/usuarios/dto/create-usuario.dto';
import { Usuario } from '../modules/usuarios/usuario.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUsuarioDto: LoginUsuarioDto) {
    const user = (await this.authService.validateUser(
      loginUsuarioDto.email,
      loginUsuarioDto.password,
    )) as Usuario | null;
    if (!user) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }
    return this.authService.login(user);
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
