import { Injectable } from '@nestjs/common';
import { ContaRepository } from '../conta.repository';

@Injectable()
export class ContaService {
  constructor(private readonly contaRepository: ContaRepository) {}

  async getAllContas() {
    return this.contaRepository.findAll();
  }
}
