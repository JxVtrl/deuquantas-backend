import { Injectable } from '@nestjs/common';
import { ComandaRepository } from '../comanda.repository';

@Injectable()
export class ComandaService {
  constructor(private readonly comandaRepository: ComandaRepository) {}

  async getAllComandas() {
    return this.comandaRepository.findAll();
  }
}
