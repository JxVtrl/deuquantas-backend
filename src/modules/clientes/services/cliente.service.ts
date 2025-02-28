import { Injectable } from '@nestjs/common';
import { ClienteRepository } from '../cliente.repository';

@Injectable()
export class ClienteService {
  constructor(private readonly clienteRepository: ClienteRepository) {}

  async getAllClientes() {
    return this.clienteRepository.findAll();
  }

  async getClienteByCpf(cpf: string) {
    return this.clienteRepository.findByCpf(cpf);
  }
}
