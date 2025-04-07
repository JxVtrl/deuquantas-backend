import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SolicitacaoMesaRepository } from '../repositories/solicitacao-mesa.repository';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SolicitacaoMesa } from '../entities/solicitacao-mesa.entity';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class SolicitacaoMesaService
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SolicitacaoMesaService.name);
  private clientRooms: Map<string, string> = new Map();

  constructor(
    @InjectRepository(SolicitacaoMesaRepository)
    private solicitacaoMesaRepository: SolicitacaoMesaRepository,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
    const room = this.clientRooms.get(client.id);
    if (room) {
      client.leave(room);
      this.clientRooms.delete(client.id);
      this.logger.log(`Cliente removido da sala: ${room}`);
    }
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, room: string) {
    this.logger.log(`Cliente ${client.id} entrando na sala: ${room}`);
    client.join(room);
    this.clientRooms.set(client.id, room);
    this.logger.log(`Cliente ${client.id} entrou na sala: ${room}`);
  }

  @SubscribeMessage('solicitar-mesa')
  async handleSolicitarMesa(
    client: Socket,
    data: { num_cnpj: string; numMesa: string; clienteId: string },
  ) {
    try {
      this.logger.log(
        `Cliente ${client.id} solicitando mesa ${data.numMesa} do estabelecimento ${data.num_cnpj}`,
      );

      const solicitacao = await this.solicitacaoMesaRepository.save({
        num_cnpj: data.num_cnpj,
        numMesa: data.numMesa,
        clienteId: data.clienteId,
        status: 'pendente',
      });

      this.logger.log(`Solicitação criada com sucesso. ID: ${solicitacao.id}`);

      // Notificar o estabelecimento
      this.server.to(data.num_cnpj).emit('nova-solicitacao', solicitacao);
      this.logger.log(
        `Estabelecimento ${data.num_cnpj} notificado sobre nova solicitação`,
      );

      // Notificar o cliente
      client.emit('solicitacao-criada', solicitacao);
      this.logger.log(
        `Cliente ${client.id} notificado sobre criação da solicitação`,
      );

      return solicitacao;
    } catch (error) {
      this.logger.error('Erro ao criar solicitação:', error);
      client.emit('erro-solicitacao', { message: 'Erro ao criar solicitação' });
      throw error;
    }
  }

  @SubscribeMessage('aprovar-solicitacao')
  async handleAprovarSolicitacao(
    client: Socket,
    data: { solicitacaoId: string },
  ) {
    try {
      this.logger.log(`Aprovando solicitação: ${data.solicitacaoId}`);

      const solicitacao = await this.solicitacaoMesaRepository.findById(
        data.solicitacaoId,
      );
      if (!solicitacao) {
        this.logger.error(`Solicitação não encontrada: ${data.solicitacaoId}`);
        throw new Error('Solicitação não encontrada');
      }

      await this.solicitacaoMesaRepository.updateStatus(
        data.solicitacaoId,
        'aprovado',
      );
      this.logger.log(`Solicitação ${data.solicitacaoId} aprovada com sucesso`);

      // Notificar o cliente
      this.server.emit('atualizacao-solicitacao', {
        ...solicitacao,
        status: 'aprovado',
      });
      this.logger.log(
        `Cliente notificado sobre aprovação da solicitação ${data.solicitacaoId}`,
      );

      // Notificar o estabelecimento
      this.server.to(solicitacao.num_cnpj).emit('solicitacao-atualizada', {
        ...solicitacao,
        status: 'aprovado',
      });
      this.logger.log(
        `Estabelecimento ${solicitacao.num_cnpj} notificado sobre aprovação da solicitação`,
      );
    } catch (error) {
      this.logger.error('Erro ao aprovar solicitação:', error);
      client.emit('erro-aprovacao', { message: 'Erro ao aprovar solicitação' });
      throw error;
    }
  }

  @SubscribeMessage('rejeitar-solicitacao')
  async handleRejeitarSolicitacao(
    client: Socket,
    data: { solicitacaoId: string },
  ) {
    try {
      this.logger.log(`Rejeitando solicitação: ${data.solicitacaoId}`);

      const solicitacao = await this.solicitacaoMesaRepository.findById(
        data.solicitacaoId,
      );
      if (!solicitacao) {
        this.logger.error(`Solicitação não encontrada: ${data.solicitacaoId}`);
        throw new Error('Solicitação não encontrada');
      }

      await this.solicitacaoMesaRepository.updateStatus(
        data.solicitacaoId,
        'rejeitado',
      );
      this.logger.log(
        `Solicitação ${data.solicitacaoId} rejeitada com sucesso`,
      );

      // Notificar o cliente
      this.server.emit('atualizacao-solicitacao', {
        ...solicitacao,
        status: 'rejeitado',
      });
      this.logger.log(
        `Cliente notificado sobre rejeição da solicitação ${data.solicitacaoId}`,
      );

      // Notificar o estabelecimento
      this.server.to(solicitacao.num_cnpj).emit('solicitacao-atualizada', {
        ...solicitacao,
        status: 'rejeitado',
      });
      this.logger.log(
        `Estabelecimento ${solicitacao.num_cnpj} notificado sobre rejeição da solicitação`,
      );
    } catch (error) {
      this.logger.error('Erro ao rejeitar solicitação:', error);
      client.emit('erro-rejeicao', { message: 'Erro ao rejeitar solicitação' });
      throw error;
    }
  }

  async getSolicitacoesPendentes(num_cnpj: string): Promise<SolicitacaoMesa[]> {
    this.logger.log(
      `Buscando solicitações pendentes para o estabelecimento: ${num_cnpj}`,
    );
    const solicitacoes =
      await this.solicitacaoMesaRepository.findPendentesByEstabelecimento(
        num_cnpj,
      );
    this.logger.log(
      `Encontradas ${solicitacoes.length} solicitações pendentes para o estabelecimento: ${num_cnpj}`,
    );
    return solicitacoes;
  }
}
