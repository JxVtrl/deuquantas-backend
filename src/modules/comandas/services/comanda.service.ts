import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Comanda } from '../comanda.entity';
import { CreateComandaDto } from '../dtos/comanda.dto';
import { ComandaResponseDto } from '../dtos/comanda-response.dto';
import { ComandaRepository } from '../comanda.repository';

@Injectable()
export class ComandaService {
  private readonly logger = new Logger(ComandaService.name);

  constructor(private readonly comandaRepository: ComandaRepository) {}

  async getAllComandas(): Promise<ComandaResponseDto[]> {
    this.logger.log('Buscando todas as comandas no banco de dados');
    const comandas = await this.comandaRepository.findAll();
    this.logger.log(`Retornando ${comandas.length} comandas do banco de dados`);
    return comandas.map((comanda) => new ComandaResponseDto(comanda));
  }

  async getComandaByCpf(num_cpf: string): Promise<ComandaResponseDto[]> {
    this.logger.log(
      `Buscando comandas para o CPF: ${num_cpf} no banco de dados`,
    );
    const comanda = await this.comandaRepository.findByCpf(num_cpf);
    this.logger.log(`Encontrada comanda para o CPF: ${num_cpf}`);
    return comanda ? [new ComandaResponseDto(comanda)] : [];
  }

  async getComandaAtivaByCpf(
    num_cpf: string,
  ): Promise<ComandaResponseDto | null> {
    this.logger.log(
      `Buscando comanda ativa para o CPF: ${num_cpf} no banco de dados`,
    );
    const comanda = await this.comandaRepository.findByCpf(num_cpf);

    if (!comanda || !comanda.is_ativo) {
      return null;
    }

    this.logger.log(`Comanda ativa encontrada para o CPF: ${num_cpf}`);
    return new ComandaResponseDto(comanda);
  }

  async createComanda(dto: CreateComandaDto): Promise<ComandaResponseDto> {
    this.logger.log(
      `Criando nova comanda para o CPF: ${dto.num_cpf} no banco de dados`,
    );

    const savedComanda = await this.comandaRepository.create({
      ...dto,
      datApropriacao: new Date(dto.datApropriacao),
      horPedido: new Date(dto.horPedido),
      codItem: dto.codItem || '',
      numQuant: dto.numQuant || 0,
      valPreco: dto.valPreco || 0,
      valTotal: (dto.valPreco || 0) * (dto.numQuant || 0),
      is_ativo: false, // Comanda inativa até ser aprovada pelo estabelecimento
      codFormaPg: 0, // Forma de pagamento não definida ainda
      horPagto: undefined,
      codErro: undefined,
      valConta: 0,
      datConta: new Date(),
    });

    this.logger.log(
      `Comanda criada com sucesso no banco de dados. CPF: ${savedComanda.num_cpf}`,
    );

    return new ComandaResponseDto(savedComanda);
  }

  async ativarComanda(num_cpf: string): Promise<ComandaResponseDto | null> {
    this.logger.debug(
      `Iniciando processo de ativação da comanda para o CPF: ${num_cpf}`,
    );

    const comanda = await this.comandaRepository.findByCpf(num_cpf);

    if (!comanda) {
      this.logger.warn(`Comanda não encontrada para o CPF: ${num_cpf}`);
      return null;
    }

    if (comanda.is_ativo) {
      this.logger.warn(`Comanda já está ativa para o CPF: ${num_cpf}`);
      return new ComandaResponseDto(comanda);
    }

    try {
      comanda.is_ativo = true;
      const updatedComanda = await this.comandaRepository.save(comanda);
      this.logger.log(`Comanda ativada com sucesso para o CPF: ${num_cpf}`);
      return new ComandaResponseDto(updatedComanda);
    } catch (error) {
      this.logger.error(`Erro ao ativar comanda para o CPF: ${num_cpf}`, error);
      throw error;
    }
  }

  async getComandaById(id: string): Promise<ComandaResponseDto> {
    this.logger.log(`Buscando comanda por ID: ${id}`);
    const comanda = await this.comandaRepository.findById(id);

    if (!comanda) {
      this.logger.error(`Comanda não encontrada para o ID: ${id}`);
      throw new NotFoundException(`Comanda não encontrada para o ID: ${id}`);
    }

    this.logger.log(`Comanda encontrada para o ID: ${id}`);
    const response = new ComandaResponseDto(comanda);
    this.logger.debug('Resposta formatada:', response);
    return response;
  }
}
