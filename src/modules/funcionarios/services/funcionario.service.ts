import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Funcionario } from '../funcionario.entity';
import { CreateFuncionarioDto } from '../dtos/funcionario.dto';

@Injectable()
export class FuncionarioService {
  constructor(
    @InjectRepository(Funcionario)
    private readonly funcionarioRepository: Repository<Funcionario>,
  ) {}

  async getAllFuncionarios(): Promise<Funcionario[]> {
    return this.funcionarioRepository.find();
  }

  async getFuncionarioByCpf(numCpf: string): Promise<Funcionario | null> {
    return this.funcionarioRepository.findOne({ where: { numCpf } });
  }

  async createFuncionario(dto: CreateFuncionarioDto): Promise<Funcionario> {
    const newFuncionario = this.funcionarioRepository.create(dto);
    return this.funcionarioRepository.save(newFuncionario);
  }
}
