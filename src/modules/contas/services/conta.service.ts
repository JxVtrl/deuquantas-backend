import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conta } from '../conta.entity';
import { CreateContaDto } from '../dtos/conta.dto';

@Injectable()
export class ContaService {
  constructor(
    @InjectRepository(Conta)
    private readonly contaRepository: Repository<Conta>,
  ) {}

  async getAllContas(): Promise<Conta[]> {
    return this.contaRepository.find();
  }

  async getContaByCpf(num_cpf: string): Promise<Conta[]> {
    return this.contaRepository.find({ where: { num_cpf } });
  }

  async createConta(dto: CreateContaDto): Promise<Conta> {
    const newConta = this.contaRepository.create(dto);
    return this.contaRepository.save(newConta);
  }
}
