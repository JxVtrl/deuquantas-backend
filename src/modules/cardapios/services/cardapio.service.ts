import { Injectable } from '@nestjs/common';
import { CardapioRepository } from '../cardapio.repository';

@Injectable()
export class CardapioService {
  constructor(private readonly cardapioRepository: CardapioRepository) {}

  async getAllCardapios() {
    return this.cardapioRepository.findAll();
  }
}
