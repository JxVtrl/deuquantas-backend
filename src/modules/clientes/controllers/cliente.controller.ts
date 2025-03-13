import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClienteService } from '../services/cliente.service';
import { CreateClienteDto } from '../dtos/cliente.dto';
import { JwtAuthGuard } from '../../../auth/auth.guard';

@ApiTags('clientes') // 🔥 Categoriza no Swagger
@ApiBearerAuth() // 🔒 Aplica autenticação JWT no Swagger
@Controller('clientes')
@UseGuards(JwtAuthGuard) // 🔐 Protege todas as rotas com JWT
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Get()
  @ApiBearerAuth() // 🔒 Garante que a rota mostra o cadeado no Swagger
  @ApiOperation({ summary: 'Lista todos os clientes (Requer autenticação)' })
  @ApiResponse({ status: 200, description: 'Clientes retornados com sucesso.' })
  async getAllClientes() {
    return this.clienteService.getAllClientes();
  }

  @Get(':numCpf')
  @ApiBearerAuth() // 🔒 Adiciona autenticação no método
  @ApiOperation({ summary: 'Busca cliente por CPF (Requer autenticação)' })
  async getClienteByCpf(@Param('numCpf') numCpf: string) {
    return this.clienteService.getClienteByCpf(numCpf);
  }

  @Post()
  @ApiBearerAuth() // 🔒 Adiciona autenticação no método
  @ApiOperation({ summary: 'Cria um novo cliente (Requer autenticação)' })
  async createCliente(@Body() createClienteDto: CreateClienteDto) {
    return this.clienteService.createCliente(createClienteDto);
  }
}
