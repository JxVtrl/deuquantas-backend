import { Injectable, NotFoundException } from '@nestjs/common';
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
    const newCliente = this.clienteRepository.create({
      numCpf: dto.numCpf,
      numCelular: dto.numCelular,
      dataNascimento: dto.dataNascimento,
      endereco: dto.endereco,
      numero: dto.numero,
      complemento: dto.complemento,
      bairro: dto.bairro,
      cidade: dto.cidade,
      estado: dto.estado,
      cep: dto.cep,
      isAtivo: dto.isAtivo,
      usuario: dto.usuario,
    });

    return this.clienteRepository.save(newCliente);
  }

  async findByEmail(email: string): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { usuario: { email } },
      relations: ['usuario'],
    });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return cliente;
  }

  async findByCPF(numCpf: string): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { numCpf },
    });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return cliente;
  }

  async findByPhone(numCelular: string): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { numCelular },
    });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return cliente;
  }

  async findByUsuarioId(usuarioId: string): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { usuario: { id: usuarioId } },
      relations: ['usuario'],
    });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return cliente;
  }
}
