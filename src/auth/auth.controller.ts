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
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginUsuarioDto) {
    const user = (await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    )) as Usuario | null;
    if (!user) {
      return {
        success: false,
        message: 'Email ou senha incorretos',
      };
    }
    return {
      success: true,
      ...(await this.authService.login(user)),
    };
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

  @Get('check-cpf/:cpf')
  @Public()
  async checkCPF(@Param('cpf') cpf: string) {
    const exists = await this.authService.checkCPFExists(cpf);
    return {
      exists,
      message: exists ? 'CPF já cadastrado' : 'CPF disponível',
    };
  }

  @Get('check-cnpj/:cnpj')
  @Public()
  async checkCNPJ(@Param('cnpj') cnpj: string) {
    const exists = await this.authService.checkCNPJExists(cnpj);
    return {
      exists,
      message: exists ? 'CNPJ já cadastrado' : 'CNPJ disponível',
    };
  }

  @Get('check-phone/:phone')
  @Public()
  async checkPhone(@Param('phone') phone: string) {
    const exists = await this.authService.checkPhoneExists(phone);
    return {
      exists,
      message: exists ? 'Número de celular já cadastrado' : 'Número de celular disponível',
    };
  }

  @Get('check-email/:email')
  @Public()
  @HttpCode(HttpStatus.OK)
  async checkEmail(@Param('email') email: string) {
    const exists = await this.authService.checkEmailExists(email);
    return {
      exists,
      message: exists 
        ? 'Este email já está cadastrado. Por favor, faça login ou use outro email.'
        : 'Email disponível para cadastro',
    };
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
