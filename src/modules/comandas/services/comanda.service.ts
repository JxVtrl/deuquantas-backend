import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comanda } from '../comanda.entity';
import { CreateComandaDto } from '../dtos/comanda.dto';
import { ContaService } from '../../contas/services/conta.service';
import { CreateContaDto } from '../../contas/dtos/conta.dto';

@Injectable()
export class ComandaService {
  private readonly logger = new Logger(ComandaService.name);

  constructor(
    @InjectRepository(Comanda)
    private readonly comandaRepository: Repository<Comanda>,
    private readonly contaService: ContaService,
  ) {}

  async getAllComandas(): Promise<Comanda[]> {
    this.logger.log('Buscando todas as comandas no banco de dados');
    const comandas = await this.comandaRepository.find({
      relations: ['conta'],
    });
    this.logger.log(`Retornando ${comandas.length} comandas do banco de dados`);
    return comandas;
  }

  async getComandaByCpf(num_cpf: string): Promise<Comanda[]> {
    this.logger.log(
      `Buscando comandas para o CPF: ${num_cpf} no banco de dados`,
    );
    const comandas = await this.comandaRepository.find({
      where: { num_cpf },
      relations: ['conta'],
    });
    this.logger.log(
      `Encontradas ${comandas.length} comandas para o CPF: ${num_cpf}`,
    );
    return comandas;
  }

  async getComandaAtivaByCpf(num_cpf: string): Promise<Comanda | null> {
    this.logger.log(
      `Buscando comanda ativa para o CPF: ${num_cpf} no banco de dados`,
    );
    const comanda = await this.comandaRepository.findOne({
      where: {
        num_cpf,
        is_ativo: true,
      },
      relations: ['conta'],
      order: {
        data_criacao: 'DESC',
      },
    });
    this.logger.log(
      `Comanda ativa ${comanda ? 'encontrada' : 'não encontrada'} para o CPF: ${num_cpf}`,
    );
    return comanda;
  }

  async createComanda(dto: CreateComandaDto): Promise<Comanda> {
    this.logger.log(
      `Criando nova comanda para o CPF: ${dto.num_cpf} no banco de dados`,
    );

    // Criar conta primeiro
    const contaDto: CreateContaDto = {
      num_cnpj: dto.num_cnpj,
      numMesa: dto.numMesa,
      num_cpf: dto.num_cpf,
      datConta: new Date().toISOString(),
      valConta: 0, // Valor inicial é zero
      codFormaPg: 0, // Forma de pagamento não definida ainda
      horPagto: undefined,
      codErro: undefined,
    };

    this.logger.log(`Criando conta para a comanda. CPF: ${dto.num_cpf}`);
    await this.contaService.createConta(contaDto);
    this.logger.log(`Conta criada com sucesso. CPF: ${dto.num_cpf}`);

    // Depois criar a comanda como inativa inicialmente
    const newComanda = this.comandaRepository.create({
      ...dto,
      is_ativo: false, // Comanda inativa até ser aprovada pelo estabelecimento
    });
    const savedComanda = await this.comandaRepository.save(newComanda);
    this.logger.log(
      `Comanda criada com sucesso no banco de dados. CPF: ${savedComanda.num_cpf}`,
    );

    return savedComanda;
  }

  async ativarComanda(num_cpf: string): Promise<Comanda | null> {
    this.logger.log(
      `Ativando comanda para o CPF: ${num_cpf} no banco de dados`,
    );

    const comanda = await this.comandaRepository.findOne({
      where: { num_cpf },
      order: {
        data_criacao: 'DESC',
      },
    });

    if (!comanda) {
      this.logger.log(`Comanda não encontrada para o CPF: ${num_cpf}`);
      return null;
    }

    comanda.is_ativo = true;
    const updatedComanda = await this.comandaRepository.save(comanda);

    this.logger.log(`Comanda ativada com sucesso para o CPF: ${num_cpf}`);

    return updatedComanda;
  }

  async getComandaById(id: string): Promise<Comanda> {
    this.logger.log(`Buscando comanda por ID: ${id}`);
    const comanda = await this.comandaRepository.findOne({
      where: { id },
      relations: ['conta'],
    });

    if (!comanda) {
      this.logger.error(`Comanda não encontrada para o ID: ${id}`);
      throw new NotFoundException(`Comanda não encontrada para o ID: ${id}`);
    }

    this.logger.log(`Comanda encontrada para o ID: ${id}`);
    return comanda;
  }
}
