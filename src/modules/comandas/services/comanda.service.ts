import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comanda } from '../comanda.entity';
import { CreateComandaDto } from '../dtos/comanda.dto';

@Injectable()
export class ComandaService {
  private readonly logger = new Logger(ComandaService.name);

  constructor(
    @InjectRepository(Comanda)
    private readonly comandaRepository: Repository<Comanda>,
  ) {}

  async getAllComandas(): Promise<Comanda[]> {
    this.logger.log('Buscando todas as comandas no banco de dados');
    const comandas = await this.comandaRepository.find();
    this.logger.log(`Retornando ${comandas.length} comandas do banco de dados`);
    return comandas;
  }

  async getComandaByCpf(num_cpf: string): Promise<Comanda[]> {
    this.logger.log(
      `Buscando comandas para o CPF: ${num_cpf} no banco de dados`,
    );
    const comandas = await this.comandaRepository.find({ where: { num_cpf } });
    this.logger.log(
      `Encontradas ${comandas.length} comandas para o CPF: ${num_cpf}`,
    );
    return comandas;
  }

  async createComanda(dto: CreateComandaDto): Promise<Comanda> {
    this.logger.log(
      `Criando nova comanda no banco de dados para o CPF: ${dto.num_cpf}`,
    );
    const newComanda = this.comandaRepository.create(dto);
    const savedComanda = await this.comandaRepository.save(newComanda);
    this.logger.log(
      `Comanda criada com sucesso no banco de dados. CPF: ${savedComanda.num_cpf}, CNPJ: ${savedComanda.num_cnpj}, Mesa: ${savedComanda.numMesa}`,
    );
    return savedComanda;
  }
}
