import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Funcionario } from '../funcionario.entity';
import { CreateFuncionarioDto } from '../dtos/funcionario.dto';

@Injectable()
export class FuncionarioService {
  private readonly logger = new Logger(FuncionarioService.name);

  constructor(
    @InjectRepository(Funcionario)
    private readonly funcionarioRepository: Repository<Funcionario>,
  ) {}

  async getAllFuncionarios(): Promise<Funcionario[]> {
    this.logger.log('Iniciando busca de todos os funcionários no repositório');
    const funcionarios = await this.funcionarioRepository.find();
    this.logger.log(
      `Busca concluída. Total de funcionários encontrados: ${funcionarios.length}`,
    );
    return funcionarios;
  }

  async getFuncionarioByCpf(num_cpf: string): Promise<Funcionario | null> {
    this.logger.log(`Iniciando busca de funcionário com CPF: ${num_cpf}`);
    const funcionario = await this.funcionarioRepository.findOne({
      where: { num_cpf },
    });
    this.logger.log(
      `Funcionário ${funcionario ? 'encontrado' : 'não encontrado'} com CPF: ${num_cpf}`,
    );
    return funcionario;
  }

  async createFuncionario(dto: CreateFuncionarioDto): Promise<Funcionario> {
    this.logger.log(
      `Iniciando criação de novo funcionário com CPF: ${dto.num_cpf}`,
    );
    const newFuncionario = this.funcionarioRepository.create(dto);
    const savedFuncionario =
      await this.funcionarioRepository.save(newFuncionario);
    this.logger.log(
      `Funcionário criado com sucesso. CPF: ${savedFuncionario.num_cpf}`,
    );
    return savedFuncionario;
  }
}
