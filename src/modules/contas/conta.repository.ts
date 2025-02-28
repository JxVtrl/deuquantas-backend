import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Conta } from './conta.entity';

@Injectable()
export class ContaRepository {
  constructor(
    @InjectRepository(Conta)
    private readonly repository: Repository<Conta>,
  ) {}

  async findAll(): Promise<Conta[]> {
    return this.repository.find();
  }

  async findByCpf(numCpf: string): Promise<Conta | null> {
    return this.repository.findOne({ where: { numCpf } });
  }
}
