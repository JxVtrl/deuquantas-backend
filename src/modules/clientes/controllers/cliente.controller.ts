import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ClienteService } from '../services/cliente.service';
import { CreateClienteDto } from '../dtos/cliente.dto';
import { JwtAuthGuard } from '../../../auth/auth.guard';

@Controller('clientes')
@UseGuards(JwtAuthGuard) // Toda a rota de clientes exige autenticação
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Get()
  async getAllClientes() {
    return this.clienteService.getAllClientes();
  }

  @Get(':numCpf')
  async getClienteByCpf(@Param('numCpf') numCpf: string) {
    return this.clienteService.getClienteByCpf(numCpf);
  }

  @Post()
  async createCliente(@Body() createClienteDto: CreateClienteDto) {
    return this.clienteService.createCliente(createClienteDto);
  }
}
