import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Funcionario } from './funcionario.entity';

@Injectable()
export class FuncionarioRepository {
  constructor(
    @InjectRepository(Funcionario)
    private readonly repository: Repository<Funcionario>,
  ) {}

  async findAll(): Promise<Funcionario[]> {
    return this.repository.find();
  }

  async findByCpf(numCpf: string): Promise<Funcionario | null> {
    return this.repository.findOne({ where: { numCpf } });
  }
}
