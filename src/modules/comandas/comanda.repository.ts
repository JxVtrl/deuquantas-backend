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

  async findByCpf(num_cpf: string): Promise<Comanda | null> {
    return this.repository.findOne({
      where: { num_cpf },
    });
  }

  async findAtivaByCpf(num_cpf: string): Promise<Comanda | null> {
    return this.repository.findOne({
      where: {
        num_cpf,
        status: 'ativo',
      },
      relations: ['conta', 'itens', 'itens.item'],
    });
  }

  async findById(id: string): Promise<Comanda | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['conta', 'itens', 'itens.item'],
    });
  }

  async save(comanda: Partial<Comanda>): Promise<Comanda> {
    return this.repository.save(comanda);
  }

  async create(data: Partial<Comanda>): Promise<Comanda> {
    const comanda = this.repository.create(data);
    return this.repository.save(comanda);
  }
}
