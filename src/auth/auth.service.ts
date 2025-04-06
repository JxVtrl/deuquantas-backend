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
import { ClienteRepository } from '../modules/clientes/cliente.repository';
import { EstabelecimentoRepository } from '../modules/estabelecimentos/estabelecimento.repository';

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
    private readonly clienteRepository: ClienteRepository,
    private readonly estabelecimentoRepository: EstabelecimentoRepository,
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
    const payload = {
      email: user.email,
      sub: user.id,
      permission_level:
        user.permission_level ||
        (user.is_admin ? 1 : user.estabelecimento ? 2 : 3),
      hasCliente: !!user.cliente,
      hasEstabelecimento: !!user.estabelecimento,
    };

    // Estrutura de resposta otimizada
    const response = {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        data_criacao: user.data_criacao,
        data_atualizacao: user.data_atualizacao,
        permission_level:
          user.permission_level ||
          (user.is_admin ? 1 : user.estabelecimento ? 2 : 3),
        ...(user.cliente && {
          cliente: {
            id: user.cliente.id,
            num_cpf: user.cliente.num_cpf,
            num_celular: user.cliente.num_celular,
            data_nascimento: user.cliente.data_nascimento,
            endereco: user.cliente.endereco,
            numero: user.cliente.numero,
            complemento: user.cliente.complemento,
            bairro: user.cliente.bairro,
            cidade: user.cliente.cidade,
            estado: user.cliente.estado,
            cep: user.cliente.cep,
          },
        }),
        ...(user.estabelecimento && {
          estabelecimento: {
            num_cnpj: user.estabelecimento.num_cnpj,
            num_celular: user.estabelecimento.num_celular,
            nome_estab: user.estabelecimento.nome_estab,
            razao_social: user.estabelecimento.razao_social,
            endereco: user.estabelecimento.endereco,
            numero: user.estabelecimento.numero,
            complemento: user.estabelecimento.complemento,
            bairro: user.estabelecimento.bairro,
            cidade: user.estabelecimento.cidade,
            estado: user.estabelecimento.estado,
            cep: user.estabelecimento.cep,
            imgLogo: user.estabelecimento.imgLogo,
            is_ativo: user.estabelecimento.is_ativo,
            status: user.estabelecimento.status,
          },
        }),
      },
    };

    console.log('Resposta final do login:', {
      token: response.token,
      user: response.user,
    });

    return response;
  }

  async register(createUsuarioClienteDto: CreateUsuarioClienteDto) {
    // Primeiro cria o usuário com dados básicos
    const {
      num_cpf,
      num_celular,
      data_nascimento,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      cep,
      ...usuarioData
    } = createUsuarioClienteDto;

    let usuario;
    try {
      // Cria o usuário primeiro
      usuario = await this.usuarioService.create(usuarioData);

      // Depois cria o cliente com os dados específicos
      const createClienteDto: CreateClienteDto = {
        name: usuarioData.name,
        email: usuarioData.email,
        num_cpf,
        num_celular,
        data_nascimento,
        endereco,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep,
        is_ativo: true,
        usuario: usuario, // Associando o usuário ao cliente
      };

      const cliente = await this.clienteService.createCliente(createClienteDto);
      console.log('Cliente criado com sucesso:', cliente);

      // Atualizar o usuário com a referência ao cliente
      await this.usuarioService.update(usuario.id, { cliente });

      // Gerar token JWT e retornar resposta similar ao login
      const payload = {
        email: usuario.email,
        sub: usuario.id,
        permission_level: 3, // Cliente sempre tem permission_level 3
        hasCliente: true,
        hasEstabelecimento: false,
      };

      // Estrutura de resposta otimizada
      const response = {
        token: this.jwtService.sign(payload),
        user: {
          id: usuario.id,
          email: usuario.email,
          name: usuario.name,
          data_criacao: usuario.data_criacao,
          data_atualizacao: usuario.data_atualizacao,
          permission_level: 3,
          cliente: {
            id: cliente.id,
            num_cpf: cliente.num_cpf,
            num_celular: cliente.num_celular,
            data_nascimento: cliente.data_nascimento,
            endereco: cliente.endereco,
            numero: cliente.numero,
            complemento: cliente.complemento,
            bairro: cliente.bairro,
            cidade: cliente.cidade,
            estado: cliente.estado,
            cep: cliente.cep,
          },
        },
      };

      return response;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      // Se houver erro, tenta remover o usuário criado para manter consistência
      if (usuario?.id) {
        try {
          await this.usuarioService.remove(usuario.id);
        } catch (removeError) {
          console.error('Erro ao remover usuário após falha:', removeError);
        }
      }
      throw error;
    }
  }

  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const user = await this.usuarioService.findByEmail(email);
      return !!user;
    } catch (error) {
      this.logger.error(`Erro ao verificar email: ${error.message}`);
      return false;
    }
  }

  async checkCPFExists(cpf: string): Promise<boolean> {
    try {
      const cliente = await this.clienteRepository.findByCpf(cpf);
      return !!cliente;
    } catch (error) {
      this.logger.error(`Erro ao verificar CPF: ${error.message}`);
      throw new InternalServerErrorException('Erro ao verificar CPF');
    }
  }

  async checkCNPJExists(cnpj: string): Promise<boolean> {
    try {
      const estabelecimento =
        await this.estabelecimentoRepository.findByNumCnpj(cnpj);
      return !!estabelecimento;
    } catch (error) {
      this.logger.error(`Erro ao verificar CNPJ: ${error.message}`);
      throw new InternalServerErrorException('Erro ao verificar CNPJ');
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
      num_cnpj,
      num_celular,
      nome_estab,
      razao_social,
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

    try {
      // Cria o usuário primeiro
      const usuario = await this.usuarioService.create(usuarioData);

      // Remove formatação do CNPJ
      const cnpjSemFormatacao = num_cnpj.replace(/\D/g, '');

      // Depois cria o estabelecimento com os dados específicos
      const createEstabelecimentoDto: CreateEstabelecimentoDto = {
        num_cnpj: cnpjSemFormatacao,
        email: usuarioData.email,
        num_celular,
        nome_estab,
        razao_social,
        endereco,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep,
        imgLogo,
        is_ativo: true,
        usuario: usuario, // Associando o usuário ao estabelecimento
      };

      const estabelecimento =
        await this.estabelecimentoService.createEstabelecimento(
          createEstabelecimentoDto,
        );
      console.log('Estabelecimento criado com sucesso:', estabelecimento);

      // Atualizar o usuário com a referência ao estabelecimento
      await this.usuarioService.update(usuario.id, { estabelecimento });

      // Gerar token JWT e retornar resposta similar ao login
      const payload = {
        email: usuario.email,
        sub: usuario.id,
        permission_level: 2, // Estabelecimento sempre tem permission_level 2
        hasCliente: false,
        hasEstabelecimento: true,
      };

      // Estrutura de resposta otimizada
      const response = {
        token: this.jwtService.sign(payload),
        user: {
          id: usuario.id,
          email: usuario.email,
          name: usuario.name,
          data_criacao: usuario.data_criacao,
          data_atualizacao: usuario.data_atualizacao,
          permission_level: 2,
          estabelecimento: {
            num_cnpj: estabelecimento.num_cnpj,
            num_celular: estabelecimento.num_celular,
            nome_estab: estabelecimento.nome_estab,
            razao_social: estabelecimento.razao_social,
            endereco: estabelecimento.endereco,
            numero: estabelecimento.numero,
            complemento: estabelecimento.complemento,
            bairro: estabelecimento.bairro,
            cidade: estabelecimento.cidade,
            estado: estabelecimento.estado,
            cep: estabelecimento.cep,
            imgLogo: estabelecimento.imgLogo,
            is_ativo: estabelecimento.is_ativo,
            status: estabelecimento.status,
          },
        },
      };

      return response;
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
      this.logger.error(
        `Erro ao verificar tipo de conta para email ${email}:`,
        error,
      );
      throw new InternalServerErrorException('Erro ao verificar tipo de conta');
    }
  }

  async getUserByEmail(email: string) {
    try {
      const user = await this.usuarioService.findByEmail(email);
      const { password, ...result } = user;
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Usuário não encontrado');
      }
      throw error;
    }
  }

  async checkPhoneExists(phone: string): Promise<boolean> {
    try {
      const [cliente, estabelecimento] = await Promise.all([
        this.clienteRepository.findByNumCelular(phone),
        this.estabelecimentoRepository.findByNumCelular(phone),
      ]);
      return !!(cliente || estabelecimento);
    } catch (error) {
      this.logger.error(`Erro ao verificar telefone: ${error.message}`);
      throw new InternalServerErrorException('Erro ao verificar telefone');
    }
  }
}
