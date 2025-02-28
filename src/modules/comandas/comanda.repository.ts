import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comanda } from './comanda.entity';

@Injectable()
export class ComandaRepository {
  constructor(
    @InjectRepository(Comanda)
    private readonly repository: Repository<Comanda>,
  ) {}

  async findAll(): Promise<Comanda[]> {
    return this.repository.find();
  }

  async findByCpf(numCpf: string): Promise<Comanda | null> {
    return this.repository.findOne({ where: { numCpf } });
  }
}
