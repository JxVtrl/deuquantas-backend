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
import { EstabelecimentoService } from '../modules/estabelecimentos/services/estabelecimento.service';
import { UsuarioService } from '../modules/usuarios/services/usuario.service';
import { CreateUsuarioClienteDto } from '../modules/usuarios/dto/create-usuario.dto';
import { CreateClienteDto } from '../modules/clientes/dtos/cliente.dto';
import { CreateUsuarioEstabelecimentoDto } from '../modules/usuarios/dto/create-usuario.dto';
import { CreateEstabelecimentoDto } from '../modules/estabelecimentos/dtos/estabelecimento.dto';

export interface CheckAccountResponseDto {
  hasClienteAccount: boolean;
  hasEstabelecimentoAccount: boolean;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly clienteService: ClienteService,
    private readonly estabelecimentoService: EstabelecimentoService,
    private readonly jwtService: JwtService,
    private readonly usuarioService: UsuarioService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usuarioService.findByEmail(email, true);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    console.log('Dados do usuário recebidos no login:', {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      cliente: user.cliente,
      estabelecimento: user.estabelecimento,
    });

    const payload = {
      email: user.email,
      sub: user.id,
      permission_level: user.isAdmin ? 1 : user.estabelecimento ? 2 : 3,
      hasCliente: !!user.cliente,
      hasEstabelecimento: !!user.estabelecimento,
    };

    console.log('Payload gerado para o token:', payload);

    const response = {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        isAtivo: user.isAtivo,
        dataCriacao: user.dataCriacao,
        dataAtualizacao: user.dataAtualizacao,
        permission_level: user.isAdmin ? 1 : user.estabelecimento ? 2 : 3,
        hasCliente: !!user.cliente,
        hasEstabelecimento: !!user.estabelecimento,
        cliente: user.cliente,
        estabelecimento: user.estabelecimento,
      },
    };

    console.log('Resposta final do login:', {
      token: response.access_token,
      user: response.user,
    });

    return response;
  }

  async register(createUsuarioClienteDto: CreateUsuarioClienteDto) {
    // Primeiro cria o usuário com dados básicos
    const {
      numCpf,
      numCelular,
      dataNascimento,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      cep,
      ...usuarioData
    } = createUsuarioClienteDto;

    const usuario = await this.usuarioService.create(usuarioData);

    // Depois cria o cliente com os dados específicos
    const createClienteDto: CreateClienteDto = {
      name: usuarioData.name,
      email: usuarioData.email,
      password: usuarioData.password,
      numCpf,
      numCelular,
      dataNascimento,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      cep,
      isAtivo: true,
      usuario: usuario, // Associando o usuário ao cliente
    };

    try {
      const cliente = await this.clienteService.createCliente(createClienteDto);
      console.log('Cliente criado com sucesso:', cliente);

      // Atualizar o usuário com a referência ao cliente
      await this.usuarioService.update(usuario.id, { cliente });

      return usuario;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  }

  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const [cliente, estabelecimento] = await Promise.all([
        this.clienteService.findByEmail(email).catch(() => null),
        this.estabelecimentoService.findByEmail(email).catch(() => null),
      ]);
      return !!(cliente || estabelecimento);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return false;
      }
      throw error;
    }
  }

  async checkCPFExists(numCpf: string): Promise<boolean> {
    try {
      const cliente = await this.clienteService.findByCPF(numCpf);
      return !!cliente;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return false;
      }
      throw error;
    }
  }

  async checkCNPJExists(numCnpj: string): Promise<boolean> {
    try {
      const estabelecimento =
        await this.estabelecimentoService.findByCNPJ(numCnpj);
      return !!estabelecimento;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return false;
      }
      throw error;
    }
  }

  async getUserData(user: any) {
    console.log('Buscando dados completos do usuário:', user.id);
    const usuario = await this.usuarioService.findById(user.id);
    console.log('Dados completos encontrados:', usuario);
    return usuario;
  }

  async registerEstablishment(
    createUsuarioEstabelecimentoDto: CreateUsuarioEstabelecimentoDto,
  ) {
    // Primeiro cria o usuário com dados básicos
    const {
      numCnpj,
      numCelular,
      nomeEstab,
      razaoSocial,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      cep,
      imgLogo,
      ...usuarioData
    } = createUsuarioEstabelecimentoDto;

    const usuario = await this.usuarioService.create(usuarioData);

    // Depois cria o estabelecimento com os dados específicos
    const createEstabelecimentoDto: CreateEstabelecimentoDto = {
      numCnpj,
      name: usuarioData.name,
      email: usuarioData.email,
      password: usuarioData.password,
      numCelular,
      nomeEstab,
      razaoSocial,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      cep,
      imgLogo,
      isAtivo: true,
      usuario: usuario, // Associando o usuário ao estabelecimento
    };

    try {
      const estabelecimento =
        await this.estabelecimentoService.createEstabelecimento(
          createEstabelecimentoDto,
        );
      console.log('Estabelecimento criado com sucesso:', estabelecimento);

      // Atualizar o usuário com a referência ao estabelecimento
      await this.usuarioService.update(usuario.id, { estabelecimento });

      return usuario;
    } catch (error) {
      console.error('Erro ao criar estabelecimento:', error);
      throw error;
    }
  }

  async checkAccountType(email: string): Promise<CheckAccountResponseDto> {
    try {
      const [cliente, estabelecimento] = await Promise.all([
        this.clienteService.findByEmail(email).catch(() => null),
        this.estabelecimentoService.findByEmail(email).catch(() => null),
      ]);

      return {
        hasClienteAccount: !!cliente,
        hasEstabelecimentoAccount: !!estabelecimento,
      };
    } catch (error) {
      this.logger.error(`Erro ao verificar tipo de conta para email ${email}:`, error);
      throw new InternalServerErrorException('Erro ao verificar tipo de conta');
    }
  }
}
