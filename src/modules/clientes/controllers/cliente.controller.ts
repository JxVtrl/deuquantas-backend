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

  @Get(':numCpf')
  @UseGuards(AuthGuard)
  @ApiBearerAuth() // 🔒 Adiciona autenticação no método
  @ApiOperation({ summary: 'Busca cliente por CPF (Requer autenticação)' })
  async getClienteByCpf(@Param('numCpf') numCpf: string) {
    return this.clienteService.getClienteByCpf(numCpf);
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

  @Get('check-document/:cpf')
  async checkCPF(@Param('cpf') cpf: string): Promise<{ exists: boolean }> {
    try {
      await this.clienteService.findByCPF(cpf);
      return { exists: true };
    } catch (error) {
      console.error('Erro ao verificar CPF:', error);
      return { exists: false };
    }
  }

  @Get('check-phone/:telefone')
  async checkPhone(
    @Param('telefone') telefone: string,
  ): Promise<{ exists: boolean }> {
    try {
      await this.clienteService.findByPhone(telefone);
      return { exists: true };
    } catch (error) {
      console.error('Erro ao verificar telefone:', error);
      return { exists: false };
    }
  }
}
