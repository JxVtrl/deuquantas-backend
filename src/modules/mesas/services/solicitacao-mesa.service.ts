import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SolicitacaoMesaRepository } from '../repositories/solicitacao-mesa.repository';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SolicitacaoMesa } from '../entities/solicitacao-mesa.entity';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class SolicitacaoMesaService implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private clientRooms: Map<string, string> = new Map();

  constructor(
    @InjectRepository(SolicitacaoMesaRepository)
    private solicitacaoMesaRepository: SolicitacaoMesaRepository,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
    const room = this.clientRooms.get(client.id);
    if (room) {
      client.leave(room);
      this.clientRooms.delete(client.id);
    }
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    this.clientRooms.set(client.id, room);
  }

  @SubscribeMessage('solicitar-mesa')
  async handleSolicitarMesa(client: Socket, data: { num_cnpj: string; numMesa: string; clienteId: string }) {
    try {
      const solicitacao = await this.solicitacaoMesaRepository.save({
        num_cnpj: data.num_cnpj,
        numMesa: data.numMesa,
        clienteId: data.clienteId,
        status: 'pendente',
      });

      // Notificar o estabelecimento
      this.server.to(data.num_cnpj).emit('nova-solicitacao', solicitacao);

      // Notificar o cliente
      client.emit('solicitacao-criada', solicitacao);

      return solicitacao;
    } catch (error) {
      console.error('Erro ao criar solicitação:', error);
      client.emit('erro-solicitacao', { message: 'Erro ao criar solicitação' });
    }
  }

  @SubscribeMessage('aprovar-solicitacao')
  async handleAprovarSolicitacao(client: Socket, data: { solicitacaoId: string }) {
    try {
      const solicitacao = await this.solicitacaoMesaRepository.findById(data.solicitacaoId);
      if (!solicitacao) {
        throw new Error('Solicitação não encontrada');
      }

      await this.solicitacaoMesaRepository.updateStatus(data.solicitacaoId, 'aprovado');

      // Notificar o cliente
      this.server.emit('atualizacao-solicitacao', {
        ...solicitacao,
        status: 'aprovado',
      });

      // Notificar o estabelecimento
      this.server.to(solicitacao.num_cnpj).emit('solicitacao-atualizada', {
        ...solicitacao,
        status: 'aprovado',
      });
    } catch (error) {
      console.error('Erro ao aprovar solicitação:', error);
      client.emit('erro-aprovacao', { message: 'Erro ao aprovar solicitação' });
    }
  }

  @SubscribeMessage('rejeitar-solicitacao')
  async handleRejeitarSolicitacao(client: Socket, data: { solicitacaoId: string }) {
    try {
      const solicitacao = await this.solicitacaoMesaRepository.findById(data.solicitacaoId);
      if (!solicitacao) {
        throw new Error('Solicitação não encontrada');
      }

      await this.solicitacaoMesaRepository.updateStatus(data.solicitacaoId, 'rejeitado');

      // Notificar o cliente
      this.server.emit('atualizacao-solicitacao', {
        ...solicitacao,
        status: 'rejeitado',
      });

      // Notificar o estabelecimento
      this.server.to(solicitacao.num_cnpj).emit('solicitacao-atualizada', {
        ...solicitacao,
        status: 'rejeitado',
      });
    } catch (error) {
      console.error('Erro ao rejeitar solicitação:', error);
      client.emit('erro-rejeicao', { message: 'Erro ao rejeitar solicitação' });
    }
  }

  async getSolicitacoesPendentes(num_cnpj: string): Promise<SolicitacaoMesa[]> {
    return this.solicitacaoMesaRepository.findPendentesByEstabelecimento(num_cnpj);
  }
} 