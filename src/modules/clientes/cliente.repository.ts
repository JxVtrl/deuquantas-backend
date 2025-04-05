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

  async findByCpf(numCpf: string): Promise<Cliente | null> {
    return this.repository.findOne({ 
      where: { numCpf },
      relations: ['usuario']
    });
  }

  async findByNumCelular(numCelular: string): Promise<Cliente | null> {
    return this.repository.findOne({ 
      where: { numCelular },
      relations: ['usuario']
    });
  }
}
