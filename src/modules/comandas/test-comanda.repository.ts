import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TestComanda } from './test-comanda.entity';

@Injectable()
export class TestComandaRepository {
  constructor(
    @InjectRepository(TestComanda)
    private readonly repository: Repository<TestComanda>,
  ) {}

  async findAll(): Promise<TestComanda[]> {
    return this.repository.find();
  }

  async findByCpf(num_cpf: string): Promise<TestComanda[]> {
    return this.repository.find({ where: { num_cpf } });
  }

  async create(data: Partial<TestComanda>): Promise<TestComanda> {
    const newTestComanda = this.repository.create(data);
    return this.repository.save(newTestComanda);
  }
}
