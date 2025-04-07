import { Controller, Get, Post, Body, Param, UseGuards, Logger } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClienteService } from '../services/cliente.service';
import { CreateClienteDto } from '../dtos/cliente.dto';
import { AuthGuard } from '../../../auth/auth.guard';

@ApiTags('clientes') // 🔥 Categoriza no Swagger
@Controller('clientes')
export class ClienteController {
  private readonly logger = new Logger(ClienteController.name);

  constructor(private readonly clienteService: ClienteService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth() // 🔒 Garante que a rota mostra o cadeado no Swagger
  @ApiOperation({ summary: 'Lista todos os clientes (Requer autenticação)' })
  @ApiResponse({ status: 200, description: 'Clientes retornados com sucesso.' })
  async getAllClientes() {
    this.logger.log('Buscando todos os clientes');
    const clientes = await this.clienteService.getAllClientes();
    this.logger.log(`Encontrados ${clientes.length} clientes`);
    return clientes;
  }

  @Get(':num_cpf')
  @UseGuards(AuthGuard)
  @ApiBearerAuth() // 🔒 Adiciona autenticação no método
  @ApiOperation({ summary: 'Busca cliente por CPF (Requer autenticação)' })
  async getClienteByCpf(@Param('num_cpf') num_cpf: string) {
    this.logger.log(`Buscando cliente para o CPF: ${num_cpf}`);
    const cliente = await this.clienteService.findByCPF(num_cpf);
    this.logger.log(`Cliente ${cliente ? 'encontrado' : 'não encontrado'} para o CPF: ${num_cpf}`);
    return cliente;
  }

  @Get('usuario/:usuarioId')
  @UseGuards(AuthGuard)
  async getClienteByUsuarioId(@Param('usuarioId') usuarioId: string) {
    this.logger.log(`Buscando cliente para o usuário: ${usuarioId}`);
    const cliente = await this.clienteService.findByUsuarioId(usuarioId);
    this.logger.log(`Cliente ${cliente ? 'encontrado' : 'não encontrado'} para o usuário: ${usuarioId}`);
    return cliente;
  }

  @Post()
  @ApiOperation({ summary: 'Cria um novo cliente' })
  async createCliente(@Body() createClienteDto: CreateClienteDto) {
    this.logger.log(`Criando novo cliente para o CPF: ${createClienteDto.num_cpf}`);
    const cliente = await this.clienteService.createCliente(createClienteDto);
    this.logger.log(`Cliente criado com sucesso para o CPF: ${createClienteDto.num_cpf}`);
    return cliente;
  }

  @Get('check-email/:email')
  async checkEmail(
    @Param('email') email: string,
  ): Promise<{ exists: boolean }> {
    this.logger.log(`Verificando existência do email: ${email}`);
    try {
      await this.clienteService.findByEmail(email);
      this.logger.log(`Email ${email} encontrado`);
      return { exists: true };
    } catch (error) {
      this.logger.error(`Erro ao verificar email ${email}:`, error);
      return { exists: false };
    }
  }

  @Get('check-cpf/:num_cpf')
  async checkCPF(
    @Param('num_cpf') num_cpf: string,
  ): Promise<{ exists: boolean }> {
    this.logger.log(`Verificando existência do CPF: ${num_cpf}`);
    try {
      await this.clienteService.findByCPF(num_cpf);
      this.logger.log(`CPF ${num_cpf} encontrado`);
      return { exists: true };
    } catch (error) {
      this.logger.error(`Erro ao verificar CPF ${num_cpf}:`, error);
      return { exists: false };
    }
  }

  @Get('check-phone/:num_celular')
  async checkPhone(
    @Param('num_celular') num_celular: string,
  ): Promise<{ exists: boolean }> {
    this.logger.log(`Verificando existência do telefone: ${num_celular}`);
    try {
      await this.clienteService.findByPhone(num_celular);
      this.logger.log(`Telefone ${num_celular} encontrado`);
      return { exists: true };
    } catch (error) {
      this.logger.error(`Erro ao verificar número de celular ${num_celular}:`, error);
      return { exists: false };
    }
  }
}
