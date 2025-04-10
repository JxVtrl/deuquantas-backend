import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Comanda } from '../comanda.entity';
import { CreateComandaDto } from '../dtos/comanda.dto';
import { ComandaResponseDto } from '../dtos/comanda-response.dto';
import { ComandaRepository } from '../comanda.repository';
import { ContaService } from '../../contas/services/conta.service';

@Injectable()
export class ComandaService {
  private readonly logger = new Logger(ComandaService.name);

  constructor(
    private readonly comandaRepository: ComandaRepository,
    private readonly contaService: ContaService,
  ) {}

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
    const comanda = await this.comandaRepository.findAtivaByCpf(num_cpf);

    if (!comanda) {
      this.logger.warn(
        `Nenhuma comanda ativa encontrada para o CPF: ${num_cpf}`,
      );
      return null;
    }

    this.logger.log(`Comanda ativa encontrada para o CPF: ${num_cpf}`);
    return new ComandaResponseDto(comanda);
  }

  async createComanda(dto: CreateComandaDto): Promise<ComandaResponseDto> {
    this.logger.log(
      `Criando nova comanda para o CPF: ${dto.num_cpf} no banco de dados`,
    );

    // Verifica se já existe uma comanda ativa para este CPF
    const comandaAtiva = await this.comandaRepository.findAtivaByCpf(
      dto.num_cpf,
    );
    if (comandaAtiva) {
      this.logger.warn(
        `Tentativa de criar nova comanda para CPF ${dto.num_cpf} que já possui comanda ativa`,
      );
      throw new BadRequestException(
        'Usuário já possui uma comanda ativa. Não é possível criar outra.',
      );
    }

    // Cria a comanda
    const savedComanda = await this.comandaRepository.create({
      ...dto,
      datApropriacao: new Date(dto.datApropriacao),
      horPedido: new Date(dto.horPedido),
      codItem: dto.codItem || '',
      numQuant: dto.numQuant || 0,
      valPreco: dto.valPreco || 0,
      valTotal: (dto.valPreco || 0) * (dto.numQuant || 0),
      status: 'ativo', // Comanda já começa ativa
      codFormaPg: 0, // Forma de pagamento não definida ainda
      horPagto: undefined,
      codErro: undefined,
    });

    // Cria a conta associada
    const contaDto = {
      id_comanda: savedComanda.id,
      num_cnpj: dto.num_cnpj,
      numMesa: dto.numMesa,
      num_cpf: dto.num_cpf,
      datConta: new Date().toISOString(),
      valConta: 0, // Valor inicial zerado
      codFormaPg: 0, // Forma de pagamento não definida ainda
    };

    const conta = await this.contaService.createConta(contaDto);

    this.logger.log(
      `Comanda e Conta criadas com sucesso no banco de dados. CPF: ${savedComanda.num_cpf}`,
    );

    // Busca a comanda com a conta relacionada
    const comandaComConta = await this.comandaRepository.findById(
      savedComanda.id,
    );
    if (!comandaComConta) {
      throw new NotFoundException(
        `Comanda não encontrada após criação: ${savedComanda.id}`,
      );
    }
    return new ComandaResponseDto(comandaComConta);
  }

  async finalizarComanda(num_cpf: string): Promise<ComandaResponseDto | null> {
    this.logger.debug(
      `Iniciando processo de finalização da comanda para o CPF: ${num_cpf}`,
    );

    const comanda = await this.comandaRepository.findAtivaByCpf(num_cpf);

    if (!comanda) {
      this.logger.warn(`Comanda não encontrada para o CPF: ${num_cpf}`);
      return null;
    }

    try {
      comanda.status = 'finalizado';
      const updatedComanda = await this.comandaRepository.save(comanda);
      this.logger.log(`Comanda finalizada com sucesso para o CPF: ${num_cpf}`);
      return new ComandaResponseDto(updatedComanda);
    } catch (error) {
      this.logger.error(
        `Erro ao finalizar comanda para o CPF: ${num_cpf}`,
        error,
      );
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
