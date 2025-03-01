import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../cliente.entity';
import { CreateClienteDto } from '../dtos/cliente.dto';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async getAllClientes(): Promise<Cliente[]> {
    return this.clienteRepository.find();
  }

  async getClienteByCpf(numCpf: string): Promise<Cliente | null> {
    return this.clienteRepository.findOne({ where: { numCpf } });
  }

  async createCliente(dto: CreateClienteDto): Promise<Cliente> {
    const newCliente = this.clienteRepository.create(dto);
    return this.clienteRepository.save(newCliente);
  }
}
