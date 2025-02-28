import { Injectable } from '@nestjs/common';
import { FuncionarioRepository } from '../funcionario.repository';

@Injectable()
export class FuncionarioService {
  constructor(private readonly funcionarioRepository: FuncionarioRepository) {}

  async getAllFuncionarios() {
    return this.funcionarioRepository.findAll();
  }
}
