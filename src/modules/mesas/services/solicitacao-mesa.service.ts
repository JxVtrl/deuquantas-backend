import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SolicitacaoMesaRepository } from '../repositories/solicitacao-mesa.repository';
import { SolicitacaoMesaDto } from '../dtos/solicitacao-mesa.dto';
import { SolicitacaoMesa } from '../entities/solicitacao-mesa.entity';
import { Repository } from 'typeorm';
import { Comanda } from '../../comandas/comanda.entity';
import { Mesa } from '../mesa.entity';
import { ComandaService } from '../../comandas/services/comanda.service';
import { CreateComandaDto } from '../../comandas/dtos/comanda.dto';

@Injectable()
export class SolicitacaoMesaService {
  private readonly logger = new Logger(SolicitacaoMesaService.name);

  constructor(
    private readonly solicitacaoMesaRepository: SolicitacaoMesaRepository,
    @InjectRepository(Mesa)
    private readonly mesaRepository: Repository<Mesa>,
    @InjectRepository(Comanda)
    private readonly comandaRepository: Repository<Comanda>,
    private readonly comandaService: ComandaService,
  ) {}

  async getSolicitacoesByEstabelecimento(
    cnpj: string,
  ): Promise<SolicitacaoMesa[]> {
    this.logger.log(
      `[DEBUG] Iniciando busca de solicitações no serviço para CNPJ: ${cnpj}`,
    );
    try {
      if (!cnpj) {
        throw new BadRequestException('CNPJ é obrigatório');
      }

      const solicitacoes =
        await this.solicitacaoMesaRepository.findPendentesByEstabelecimento(
          cnpj,
        );
      this.logger.log(
        `[DEBUG] Solicitações encontradas no banco: ${JSON.stringify(solicitacoes)}`,
      );
      return solicitacoes;
    } catch (error) {
      this.logger.error(
        `[DEBUG] Erro ao buscar solicitações no serviço para CNPJ ${cnpj}:`,
        error,
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Erro ao buscar solicitações: ${error.message}`);
    }
  }

  async getSolicitacaoById(id: string): Promise<SolicitacaoMesa | null> {
    this.logger.log(`[DEBUG] Buscando solicitação por ID: ${id}`);
    try {
      if (!id) {
        throw new BadRequestException('ID é obrigatório');
      }

      const solicitacao = await this.solicitacaoMesaRepository.findById(id);
      if (!solicitacao) {
        throw new NotFoundException(`Solicitação com ID ${id} não encontrada`);
      }

      this.logger.log(
        `[DEBUG] Solicitação encontrada: ${JSON.stringify(solicitacao)}`,
      );
      return solicitacao;
    } catch (error) {
      this.logger.error(
        `[DEBUG] Erro ao buscar solicitação por ID ${id}:`,
        error,
      );
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new Error(`Erro ao buscar solicitação: ${error.message}`);
    }
  }

  async solicitarMesa(solicitacao: SolicitacaoMesaDto) {
    try {
      this.logger.log(
        `[DEBUG] Iniciando solicitação de mesa: ${JSON.stringify(solicitacao)}`,
      );

      // Validações
      if (
        !solicitacao.num_cnpj ||
        !solicitacao.numMesa ||
        !solicitacao.clienteId
      ) {
        this.logger.error('[DEBUG] Dados incompletos:', { solicitacao });
        throw new BadRequestException(
          'Dados incompletos para solicitação de mesa',
        );
      }

      // Verificar se a mesa existe e está disponível
      const mesa = await this.mesaRepository.findOne({
        where: {
          num_cnpj: solicitacao.num_cnpj,
          numMesa: solicitacao.numMesa,
          status: 'disponivel',
        },
      });

      if (!mesa) {
        this.logger.error('[DEBUG] Mesa não encontrada ou indisponível:', {
          num_cnpj: solicitacao.num_cnpj,
          numMesa: solicitacao.numMesa,
        });
        throw new NotFoundException('Mesa não encontrada ou indisponível');
      }

      // Verificar se já existe uma solicitação pendente para esta mesa
      const solicitacaoExistente = await this.solicitacaoMesaRepository.findOne(
        {
          num_cnpj: solicitacao.num_cnpj,
          numMesa: solicitacao.numMesa,
          status: 'pendente',
        },
      );

      if (solicitacaoExistente) {
        this.logger.error('[DEBUG] Solicitação pendente já existe:', {
          solicitacaoExistente,
        });
        throw new BadRequestException(
          'Já existe uma solicitação pendente para esta mesa',
        );
      }

      const solicitacaoSalva = await this.solicitacaoMesaRepository.save({
        ...solicitacao,
        dataSolicitacao: new Date(),
        dataAtualizacao: new Date(),
      } as SolicitacaoMesa);

      this.logger.log(
        `[DEBUG] Solicitação criada com sucesso: ${JSON.stringify(solicitacaoSalva)}`,
      );

      return solicitacaoSalva;
    } catch (error) {
      this.logger.error(
        `[DEBUG] Erro ao criar solicitação: ${error.message}`,
        error.stack,
      );
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new Error(`Erro ao criar solicitação: ${error.message}`);
    }
  }

  async aprovarSolicitacao(id: string): Promise<SolicitacaoMesa> {
    this.logger.log(`[DEBUG] Aprovando solicitação: ${id}`);
    try {
      if (!id) {
        throw new BadRequestException('ID é obrigatório');
      }

      const solicitacao = await this.solicitacaoMesaRepository.findById(id);
      if (!solicitacao) {
        throw new NotFoundException(`Solicitação com ID ${id} não encontrada`);
      }

      if (solicitacao.status !== 'pendente') {
        throw new BadRequestException(
          'Apenas solicitações pendentes podem ser aprovadas',
        );
      }

      const comandaDto: CreateComandaDto = {
        num_cpf: solicitacao.clienteId,
        num_cnpj: solicitacao.num_cnpj,
        numMesa: solicitacao.numMesa,
        datApropriacao: new Date().toISOString(),
        horPedido: new Date().toISOString(),
      };

      // Criar a comanda (já começa ativa)
      const comanda = await this.comandaService.createComanda(comandaDto);

      console.log('[DEBUG] COMANDA CRIADA', JSON.stringify(comanda, null, 2));

      // Atualizar status da solicitação
      solicitacao.status = 'aprovado';
      solicitacao.dataAtualizacao = new Date();

      const solicitacaoAtualizada =
        await this.solicitacaoMesaRepository.save(solicitacao);

      this.logger.log(
        `[DEBUG] Solicitação aprovada com sucesso: ${JSON.stringify(solicitacaoAtualizada)}`,
      );

      return solicitacaoAtualizada;
    } catch (error) {
      this.logger.error(`[DEBUG] Erro ao aprovar solicitação ${id}:`, error);
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new Error(`Erro ao aprovar solicitação: ${error.message}`);
    }
  }

  async rejeitarSolicitacao(id: string): Promise<SolicitacaoMesa> {
    this.logger.log(`[DEBUG] Rejeitando solicitação: ${id}`);
    try {
      if (!id) {
        throw new BadRequestException('ID é obrigatório');
      }

      const solicitacao = await this.solicitacaoMesaRepository.findById(id);
      if (!solicitacao) {
        throw new NotFoundException(`Solicitação com ID ${id} não encontrada`);
      }

      if (solicitacao.status !== 'pendente') {
        throw new BadRequestException(
          'Apenas solicitações pendentes podem ser rejeitadas',
        );
      }

      await this.solicitacaoMesaRepository.updateStatus(id, 'rejeitado');
      this.logger.log(`[DEBUG] Solicitação ${id} rejeitada com sucesso`);

      return solicitacao;
    } catch (error) {
      this.logger.error(`[DEBUG] Erro ao rejeitar solicitação ${id}:`, error);
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new Error(`Erro ao rejeitar solicitação: ${error.message}`);
    }
  }
}
