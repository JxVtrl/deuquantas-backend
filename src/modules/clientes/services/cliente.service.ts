import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../cliente.entity';
import { CreateClienteDto } from '../dtos/cliente.dto';
import * as bcrypt from 'bcryptjs';

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
    // Criptografa a senha antes de salvar
    const salt = await bcrypt.genSalt();
    const senhaHash = await bcrypt.hash(dto.senha, salt);

    const newCliente = this.clienteRepository.create({
      ...dto,
      senha: senhaHash,
    });

    return this.clienteRepository.save(newCliente);
  }

  async findByEmail(email: string): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { email },
    });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return cliente;
  }

  async findByCPF(cpf: string): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { numCpf: cpf },
    });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return cliente;
  }

  async findByPhone(telefone: string): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { telefone },
    });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return cliente;
  }
}
