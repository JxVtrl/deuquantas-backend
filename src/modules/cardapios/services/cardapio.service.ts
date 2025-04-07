import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cardapio } from '../cardapio.entity';
import { CreateCardapioDto } from '../dtos/cardapio.dto';

@Injectable()
export class CardapioService {
  private readonly logger = new Logger(CardapioService.name);

  constructor(
    @InjectRepository(Cardapio)
    private readonly cardapioRepository: Repository<Cardapio>,
  ) {}

  async getAllCardapios(): Promise<Cardapio[]> {
    this.logger.log('Buscando todos os cardápios no banco de dados');
    const cardapios = await this.cardapioRepository.find();
    this.logger.log(`Encontrados ${cardapios.length} cardápios no banco de dados`);
    return cardapios;
  }

  async getCardapioByCnpj(num_cnpj: string): Promise<Cardapio[]> {
    this.logger.log(`Buscando cardápios para o CNPJ: ${num_cnpj} no banco de dados`);
    const cardapios = await this.cardapioRepository.find({ where: { num_cnpj } });
    this.logger.log(`Encontrados ${cardapios.length} cardápios para o CNPJ: ${num_cnpj} no banco de dados`);
    return cardapios;
  }

  async createCardapio(dto: CreateCardapioDto): Promise<Cardapio> {
    this.logger.log('Iniciando criação de novo cardápio no banco de dados');
    const newCardapio = this.cardapioRepository.create(dto);
    const savedCardapio = await this.cardapioRepository.save(newCardapio);
    this.logger.log(`Cardápio criado com sucesso no banco de dados. CNPJ: ${savedCardapio.num_cnpj}, Ordem: ${savedCardapio.numOrdem}`);
    return savedCardapio;
  }
}
