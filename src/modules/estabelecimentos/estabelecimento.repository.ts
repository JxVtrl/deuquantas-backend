import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Estabelecimento } from './estabelecimento.entity';

@Injectable()
export class EstabelecimentoRepository {
  constructor(
    @InjectRepository(Estabelecimento)
    private readonly repository: Repository<Estabelecimento>,
  ) {}

  async findAll(): Promise<Estabelecimento[]> {
    return this.repository.find();
  }

  async findByNome(nomeEstab: string): Promise<Estabelecimento | null> {
    return this.repository.findOne({ where: { nomeEstab } });
  }

  async findByNumCelular(numCelular: string): Promise<Estabelecimento | null> {
    return this.repository.findOne({ where: { numCelular } });
  }
}
