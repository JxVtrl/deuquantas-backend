import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conta } from '../conta.entity';
import { CreateContaDto } from '../dtos/conta.dto';

@Injectable()
export class ContaService {
  private readonly logger = new Logger(ContaService.name);

  constructor(
    @InjectRepository(Conta)
    private readonly contaRepository: Repository<Conta>,
  ) {}

  async getAllContas(): Promise<Conta[]> {
    this.logger.log('Buscando todas as contas no banco de dados');
    const contas = await this.contaRepository.find();
    this.logger.log(`Encontradas ${contas.length} contas no banco de dados`);
    return contas;
  }

  async getContaByCpf(num_cpf: string): Promise<Conta[]> {
    this.logger.log(`Buscando contas para o CPF: ${num_cpf} no banco de dados`);
    const contas = await this.contaRepository.find({
      where: { id_comanda: num_cpf },
    });
    this.logger.log(
      `Encontradas ${contas.length} contas para o CPF: ${num_cpf} no banco de dados`,
    );
    return contas;
  }

  async createConta(dto: CreateContaDto): Promise<Conta> {
    this.logger.log(
      `Criando nova conta para o CPF: ${dto.id_comanda} no banco de dados`,
    );
    const newConta = this.contaRepository.create(dto);
    const savedConta = await this.contaRepository.save(newConta);
    this.logger.log(
      `Conta criada com sucesso no banco de dados. CPF: ${savedConta.id_comanda}`,
    );
    return savedConta;
  }
}
