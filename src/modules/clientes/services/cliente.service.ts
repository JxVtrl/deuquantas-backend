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

  async getClienteByCpf(num_cpf: string): Promise<Cliente | null> {
    return this.clienteRepository.findOne({ where: { num_cpf } });
  }

  async createCliente(dto: CreateClienteDto): Promise<Cliente> {
    const newCliente = this.clienteRepository.create({
      num_cpf: dto.num_cpf,
      num_celular: dto.num_celular,
      data_nascimento: dto.data_nascimento,
      endereco: dto.endereco,
      numero: dto.numero,
      complemento: dto.complemento,
      bairro: dto.bairro,
      cidade: dto.cidade,
      estado: dto.estado,
      cep: dto.cep,
      is_ativo: dto.is_ativo,
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

  async findByCPF(num_cpf: string): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { num_cpf },
    });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return cliente;
  }

  async findByPhone(num_celular: string): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { num_celular },
    });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return cliente;
  }

  async findByUsuarioId(usuarioId: string): Promise<Cliente> {
    console.log('🔍 Buscando cliente para o usuário:', usuarioId);

    const cliente = await this.clienteRepository
      .createQueryBuilder('cliente')
      .leftJoinAndSelect('cliente.usuario', 'usuario')
      .where('usuario.id = :usuarioId', { usuarioId })
      .getOne();

    console.log('📌 Resultado da busca:', cliente);

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return cliente;
  }
}
