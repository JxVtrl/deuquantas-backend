import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ClienteService } from '../modules/clientes/services/cliente.service';
import { LoginUsuarioDto } from '../modules/usuarios/dto/login-usuario.dto';
import { CreateUsuarioDto } from '../modules/usuarios/dto/create-usuario.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly clienteService: ClienteService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const cliente = await this.clienteService.findByEmail(email);

      if (!cliente) {
        this.logger.warn(
          `Tentativa de login com email não encontrado: ${email}`,
        );
        return null;
      }

      const senhaCorreta = await bcrypt.compare(password, cliente.senha);
      if (!senhaCorreta) {
        this.logger.warn(`Senha incorreta para o usuário: ${email}`);
        return null;
      }

      const { senha: _, ...result } = cliente;
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
      const { email, password } = loginUsuarioDto;

      console.log('loginUsuarioDto', loginUsuarioDto);

      if (!email || !password) {
        throw new BadRequestException('Email e senha são obrigatórios');
      }

      const usuario = await this.validateUser(email, password);

      if (!usuario) {
        throw new UnauthorizedException(
          'Credenciais inválidas. Verifique seu email e senha.',
        );
      }

      // Determinar o nível de permissão com base no isAdmin
      const permission_level = 3; // 3 para cliente comum

      const payload = {
        sub: usuario.numCpf,
        email: usuario.email,
        nome: usuario.nome,
        isAdmin: false,
        permission_level: permission_level,
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
      this.logger.log(
        `Tentativa de registro para email: ${createUsuarioDto.email}`,
      );

      // Verificar se o usuário já existe sem lançar erro
      let usuarioExistente;
      try {
        usuarioExistente = await this.clienteService.findByEmail(
          createUsuarioDto.email,
        );
      } catch (error) {
        if (!(error instanceof NotFoundException)) {
          throw error; // Se for um erro diferente, relançamos
        }
      }

      if (usuarioExistente) {
        this.logger.warn(
          `Tentativa de registro com email já existente: ${createUsuarioDto.email}`,
        );
        throw new ConflictException(
          'Este email já está em uso. Por favor, use outro email.',
        );
      }

      this.logger.log(
        `Criando usuário com os dados: ${JSON.stringify(createUsuarioDto)}`,
      );

      const novoUsuario =
        await this.clienteService.createCliente(createUsuarioDto);

      this.logger.log(`Usuário criado com sucesso: CPF ${novoUsuario.numCpf}`);

      return novoUsuario;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
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
