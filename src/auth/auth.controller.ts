import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UnauthorizedException,
  UseGuards,
  Req,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUsuarioDto } from '../modules/usuarios/dto/login-usuario.dto';
import {
  CreateUsuarioClienteDto,
  CreateUsuarioEstabelecimentoDto,
} from '../modules/usuarios/dto/create-usuario.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';
import { Usuario } from '../modules/usuarios/usuario.entity';
import { CheckAccountResponseDto } from './auth.service';
import { Public } from './decorators/public.decorator';

interface RequestWithUser extends Request {
  user: Usuario;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
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
  @Public()
  async register(@Body() createUsuarioClienteDto: CreateUsuarioClienteDto) {
    return this.authService.register(createUsuarioClienteDto);
  }

  @Post('register-establishment')
  @Public()
  async registerEstablishment(
    @Body() createUsuarioEstabelecimentoDto: CreateUsuarioEstabelecimentoDto,
  ) {
    return this.authService.registerEstablishment(
      createUsuarioEstabelecimentoDto,
    );
  }

  @Get('check-cpf/:numCpf')
  @Public()
  @HttpCode(HttpStatus.OK)
  async checkCPFExists(@Param('numCpf') numCpf: string) {
    return this.authService.checkCPFExists(numCpf);
  }

  @Get('check-cnpj/:numCnpj')
  @Public()
  @HttpCode(HttpStatus.OK)
  async checkCNPJExists(@Param('numCnpj') numCnpj: string) {
    return this.authService.checkCNPJExists(numCnpj);
  }

  @Get('check-phone/:numCelular')
  @Public()
  @HttpCode(HttpStatus.OK)
  async checkPhoneExists(@Param('numCelular') numCelular: string) {
    return this.authService.checkPhoneExists(numCelular);
  }

  @Get('check-email/:email')
  @Public()
  @HttpCode(HttpStatus.OK)
  async checkEmailExists(@Param('email') email: string) {
    return this.authService.checkEmailExists(email);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: RequestWithUser) {
    const user = await this.authService.getUserData(req.user);
    return { user };
  }

  @Get('check-account')
  @Public()
  @HttpCode(HttpStatus.OK)
  async checkAccountType(
    @Query('email') email: string,
  ): Promise<CheckAccountResponseDto> {
    return this.authService.checkAccountType(email);
  }

  @Get('user-by-email/:email')
  @HttpCode(HttpStatus.OK)
  async getUserByEmail(@Param('email') email: string) {
    return this.authService.getUserByEmail(email);
  }
}
