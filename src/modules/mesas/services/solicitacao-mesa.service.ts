import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SolicitacaoMesaRepository } from '../repositories/solicitacao-mesa.repository';
import { SolicitacaoMesaDto } from '../dtos/solicitacao-mesa.dto';
import { SolicitacaoMesa } from '../entities/solicitacao-mesa.entity';
import { SocketGateway } from '../../socket/socket.gateway';
import { Repository } from 'typeorm';
import { Comanda } from '../../comandas/comanda.entity';
import { Mesa } from '../mesa.entity';

@Injectable()
export class SolicitacaoMesaService {
  private readonly logger = new Logger(SolicitacaoMesaService.name);

  constructor(
    private readonly solicitacaoMesaRepository: SolicitacaoMesaRepository,
    @InjectRepository(Mesa)
    private readonly mesaRepository: Repository<Mesa>,
    @InjectRepository(Comanda)
    private readonly comandaRepository: Repository<Comanda>,
    private readonly socketGateway: SocketGateway,
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
          is_ativo: true,
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

      // Notificar o estabelecimento via socket
      const room = `estabelecimento:${solicitacao.num_cnpj}`;
      this.logger.log(
        `[DEBUG] Tentando notificar estabelecimento na sala ${room}`,
      );

      const server = this.socketGateway.getServer();
      if (!server) {
        this.logger.error('[DEBUG] Servidor de socket não disponível');
        throw new Error('Servidor de socket não disponível');
      }

      // Verificar se há clientes na sala antes de enviar
      const sockets = await server.in(room).allSockets();
      this.logger.log(`[DEBUG] Clientes na sala ${room}: ${sockets.size}`);
      this.logger.log(
        `[DEBUG] IDs dos clientes na sala: ${Array.from(sockets).join(', ')}`,
      );

      if (sockets.size === 0) {
        this.logger.warn(`[DEBUG] Nenhum cliente encontrado na sala ${room}`);
      }

      // Enviar notificação para a sala
      server.to(room).emit('nova-solicitacao', {
        type: 'nova-solicitacao',
        data: solicitacaoSalva,
      });

      this.logger.log(`[DEBUG] Notificação enviada para a sala ${room}`);

      // Enviar notificação geral (para debug)
      server.emit('debug-nova-solicitacao', {
        type: 'nova-solicitacao',
        room: room,
        data: solicitacaoSalva,
      });

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

      await this.solicitacaoMesaRepository.updateStatus(id, 'aprovado');
      this.logger.log(`[DEBUG] Solicitação ${id} aprovada com sucesso`);

      // Atualizar status da mesa
      await this.mesaRepository.update(
        { num_cnpj: solicitacao.num_cnpj, numMesa: solicitacao.numMesa },
        { status: 'ocupada' },
      );

      // Notificar o cliente
      this.socketGateway.getServer().emit('atualizacao-solicitacao', {
        ...solicitacao,
        status: 'aprovado',
      });

      // Notificar o estabelecimento
      this.socketGateway
        .getServer()
        .to(solicitacao.num_cnpj)
        .emit('solicitacao-atualizada', {
          ...solicitacao,
          status: 'aprovado',
        });

      return solicitacao;
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

      // Notificar o cliente
      this.socketGateway.getServer().emit('atualizacao-solicitacao', {
        ...solicitacao,
        status: 'rejeitado',
      });

      // Notificar o estabelecimento
      this.socketGateway
        .getServer()
        .to(solicitacao.num_cnpj)
        .emit('solicitacao-atualizada', {
          ...solicitacao,
          status: 'rejeitado',
        });

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
