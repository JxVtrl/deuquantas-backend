import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cardapio } from '../cardapio.entity';
import { CreateCardapioDto } from '../dtos/cardapio.dto';

@Injectable()
export class CardapioService {
  constructor(
    @InjectRepository(Cardapio)
    private readonly cardapioRepository: Repository<Cardapio>,
  ) {}

  async getAllCardapios(): Promise<Cardapio[]> {
    return this.cardapioRepository.find();
  }

  async getCardapioByCnpj(numCnpj: string): Promise<Cardapio[]> {
    return this.cardapioRepository.find({ where: { numCnpj } });
  }

  async createCardapio(dto: CreateCardapioDto): Promise<Cardapio> {
    const newCardapio = this.cardapioRepository.create(dto);
    return this.cardapioRepository.save(newCardapio);
  }
}
