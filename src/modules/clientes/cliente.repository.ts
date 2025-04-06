import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from './cliente.entity';

@Injectable()
export class ClienteRepository {
  constructor(
    @InjectRepository(Cliente)
    private readonly repository: Repository<Cliente>,
  ) {}

  async findAll(): Promise<Cliente[]> {
    return this.repository.find();
  }

  async findByCpf(num_cpf: string): Promise<Cliente | null> {
    return this.repository.findOne({
      where: { num_cpf },
      relations: ['usuario'],
    });
  }

  async findByNumCelular(num_celular: string): Promise<Cliente | null> {
    return this.repository.findOne({
      where: { num_celular },
      relations: ['usuario'],
    });
  }
}
