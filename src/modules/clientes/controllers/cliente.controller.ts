import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
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
  constructor(private readonly clienteService: ClienteService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth() // 🔒 Garante que a rota mostra o cadeado no Swagger
  @ApiOperation({ summary: 'Lista todos os clientes (Requer autenticação)' })
  @ApiResponse({ status: 200, description: 'Clientes retornados com sucesso.' })
  async getAllClientes() {
    return this.clienteService.getAllClientes();
  }

  @Get(':num_cpf')
  @UseGuards(AuthGuard)
  @ApiBearerAuth() // 🔒 Adiciona autenticação no método
  @ApiOperation({ summary: 'Busca cliente por CPF (Requer autenticação)' })
  async getClienteByCpf(@Param('num_cpf') num_cpf: string) {
    return await this.clienteService.findByCPF(num_cpf);
  }

  @Get('usuario/:usuarioId')
  @UseGuards(AuthGuard)
  async getClienteByUsuarioId(@Param('usuarioId') usuarioId: string) {
    return await this.clienteService.findByUsuarioId(usuarioId);
  }

  @Post()
  @ApiOperation({ summary: 'Cria um novo cliente' })
  async createCliente(@Body() createClienteDto: CreateClienteDto) {
    return this.clienteService.createCliente(createClienteDto);
  }

  @Get('check-email/:email')
  async checkEmail(
    @Param('email') email: string,
  ): Promise<{ exists: boolean }> {
    try {
      await this.clienteService.findByEmail(email);
      return { exists: true };
    } catch (error) {
      console.error('Erro ao verificar email:', error);
      return { exists: false };
    }
  }

  @Get('check-cpf/:num_cpf')
  async checkCPF(
    @Param('num_cpf') num_cpf: string,
  ): Promise<{ exists: boolean }> {
    try {
      await this.clienteService.findByCPF(num_cpf);
      return { exists: true };
    } catch (error) {
      console.error('Erro ao verificar CPF:', error);
      return { exists: false };
    }
  }

  @Get('check-phone/:num_celular')
  async checkPhone(
    @Param('num_celular') num_celular: string,
  ): Promise<{ exists: boolean }> {
    try {
      await this.clienteService.findByPhone(num_celular);
      return { exists: true };
    } catch (error) {
      console.error('Erro ao verificar número de celular:', error);
      return { exists: false };
    }
  }
}
