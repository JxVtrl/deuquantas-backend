import { Injectable } from '@nestjs/common';
import { MesaRepository } from '../mesa.repository';

@Injectable()
export class MesaService {
  constructor(private readonly mesaRepository: MesaRepository) {}

  async getAllMesas() {
    return this.mesaRepository.findAll();
  }
}
