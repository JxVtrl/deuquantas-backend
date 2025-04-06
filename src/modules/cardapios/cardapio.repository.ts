import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cardapio } from './cardapio.entity';

@Injectable()
export class CardapioRepository {
  constructor(
    @InjectRepository(Cardapio)
    private readonly repository: Repository<Cardapio>,
  ) {}

  async findAll(): Promise<Cardapio[]> {
    return this.repository.find({ relations: ['estabelecimento', 'item'] });
  }

  async findByNomeRestaurante(nome_estab: string): Promise<Cardapio[]> {
    return this.repository.find({
      where: { estabelecimento: { nome_estab } },
      relations: ['estabelecimento', 'item'],
    });
  }

  async findByCodigoItem(codItem: string): Promise<Cardapio[]> {
    return this.repository.find({
      where: { item: { codItem } },
      relations: ['estabelecimento', 'item'],
    });
  }
}
