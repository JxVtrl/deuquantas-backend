import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsuarioService } from '../modules/usuarios/services/usuario.service';
import { LoginUsuarioDto } from '../modules/usuarios/dto/login-usuario.dto';
import { CreateUsuarioDto } from '../modules/usuarios/dto/create-usuario.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, senha: string): Promise<any> {
    try {
      const usuario = await this.usuarioService.findByEmail(email, true);

      if (!usuario) {
        this.logger.warn(
          `Tentativa de login com email não encontrado: ${email}`,
        );
        return null;
      }

      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
      if (!senhaCorreta) {
        this.logger.warn(`Senha incorreta para o usuário: ${email}`);
        return null;
      }

      const { senha: _, ...result } = usuario;
      return result;
    } catch (error) {
      this.logger.error(
        `Erro ao validar usuário: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  async login(
    loginUsuarioDto: LoginUsuarioDto,
  ): Promise<{ access_token: string }> {
    try {
      const { email, senha } = loginUsuarioDto;

      if (!email || !senha) {
        throw new BadRequestException('Email e senha são obrigatórios');
      }

      const usuario = await this.validateUser(email, senha);

      if (!usuario) {
        throw new UnauthorizedException(
          'Credenciais inválidas. Verifique seu email e senha.',
        );
      }

      const payload = {
        sub: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        isAdmin: usuario.isAdmin,
      };

      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(`Erro durante o login: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'Ocorreu um erro durante o login. Por favor, tente novamente mais tarde.',
      );
    }
  }

  async register(createUsuarioDto: CreateUsuarioDto) {
    try {
      // Verificar se o email já existe
      const usuarioExistente = await this.usuarioService.findByEmail(
        createUsuarioDto.email,
        false,
      );
      if (usuarioExistente) {
        throw new BadRequestException(
          'Este email já está em uso. Por favor, use outro email.',
        );
      }

      return await this.usuarioService.create(createUsuarioDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(
        `Erro durante o registro: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Ocorreu um erro durante o registro. Por favor, tente novamente mais tarde.',
      );
    }
  }
}
