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

  async findByNome(nome_estab: string): Promise<Estabelecimento | null> {
    return this.repository.findOne({ where: { nome_estab } });
  }

  async findByNumCelular(num_celular: string): Promise<Estabelecimento | null> {
    return this.repository.findOne({ where: { num_celular } });
  }

  async findByNumCnpj(num_cnpj: string): Promise<Estabelecimento | null> {
    return this.repository.findOne({
      where: { num_cnpj },
    });
  }
}
