import { Controller, Get, Param } from '@nestjs/common';
import { ClienteService } from '../services/cliente.service';

@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Get()
  async getAllClientes() {
    return this.clienteService.getAllClientes();
  }

  @Get(':cpf')
  async getClienteByCpf(@Param('cpf') cpf: string) {
    return this.clienteService.getClienteByCpf(cpf);
  }
}
