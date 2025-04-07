import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestComanda } from '../test-comanda.entity';
import { CreateComandaDto } from '../dtos/comanda.dto';

@Injectable()
export class TestComandaService {
  private readonly logger = new Logger(TestComandaService.name);

  constructor(
    @InjectRepository(TestComanda)
    private readonly testComandaRepository: Repository<TestComanda>,
  ) {}

  async getAllTestComandas(): Promise<TestComanda[]> {
    this.logger.log('Buscando todas as comandas de teste no banco de dados');
    const comandas = await this.testComandaRepository.find();
    this.logger.log(`Retornando ${comandas.length} comandas de teste do banco de dados`);
    return comandas;
  }

  async getTestComandaByCpf(num_cpf: string): Promise<TestComanda[]> {
    this.logger.log(`Buscando comandas de teste para o CPF: ${num_cpf} no banco de dados`);
    const comandas = await this.testComandaRepository.find({ where: { num_cpf } });
    this.logger.log(`Encontradas ${comandas.length} comandas de teste para o CPF: ${num_cpf}`);
    return comandas;
  }

  async createTestComanda(dto: CreateComandaDto): Promise<TestComanda> {
    this.logger.log(`Criando nova comanda de teste no banco de dados para o CPF: ${dto.num_cpf}`);
    // Converter as datas de string para Date
    const testComandaData = {
      ...dto,
      datApropriacao: new Date(dto.datApropriacao),
      horPedido: new Date(dto.horPedido),
      isTestData: true,
    };

    const newTestComanda = this.testComandaRepository.create(testComandaData);
    const savedComanda = await this.testComandaRepository.save(newTestComanda);
    this.logger.log(`Comanda de teste criada com sucesso no banco de dados. CPF: ${savedComanda.num_cpf}, CNPJ: ${savedComanda.num_cnpj}, Mesa: ${savedComanda.numMesa}`);
    return savedComanda;
  }
}
