import { Injectable } from '@nestjs/common';
import { EstabelecimentoRepository } from '../estabelecimento.repository';

@Injectable()
export class EstabelecimentoService {
  constructor(private readonly estabelecimentoRepository: EstabelecimentoRepository) {}

  async getAllEstabelecimentos() {
    return this.estabelecimentoRepository.findAll();
  }
}
