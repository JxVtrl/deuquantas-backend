import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UnauthorizedException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUsuarioDto } from '../modules/usuarios/dto/login-usuario.dto';
import { CreateUsuarioClienteDto, CreateUsuarioEstabelecimentoDto } from '../modules/usuarios/dto/create-usuario.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';
import { Usuario } from '../modules/usuarios/usuario.entity';

interface RequestWithUser extends Request {
  user: Usuario;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginUsuarioDto) {
    const user = (await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
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

  @Post('register-establishment')
  async registerEstablishment(@Body() createUsuarioEstabelecimentoDto: CreateUsuarioEstabelecimentoDto) {
    return this.authService.registerEstablishment(createUsuarioEstabelecimentoDto);
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

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: RequestWithUser) {
    const user = await this.authService.getUserData(req.user);
    return { user };
  }
}
