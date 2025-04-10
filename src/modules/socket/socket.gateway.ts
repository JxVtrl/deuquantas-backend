import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SolicitacaoMesaService } from '../mesas/services/solicitacao-mesa.service';

interface ErrorWithMessage {
  message: string;
}

interface SolicitacaoMesaDto {
  num_cnpj: string;
  numMesa: string;
  clienteId: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

function getErrorMessage(error: unknown): string {
  if (isErrorWithMessage(error)) {
    return error.message;
  }
  return 'Erro desconhecido';
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://0.0.0.0:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3001',
      'http://0.0.0.0:3001',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 10000,
  pingInterval: 5000,
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SocketGateway.name);
  private readonly roomPrefix = 'estabelecimento:';
  private clientRooms = new Map<string, string[]>();

  constructor(
    @Inject(forwardRef(() => SolicitacaoMesaService))
    private readonly solicitacaoMesaService: SolicitacaoMesaService,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
    this.clientRooms.set(client.id, []);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
    const rooms = this.clientRooms.get(client.id) || [];
    rooms.forEach((room) => {
      this.logger.log(`Removendo cliente ${client.id} da sala ${room}`);
      client.leave(room);
    });
    this.clientRooms.delete(client.id);
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    client: Socket,
    roomName: string,
    callback?: (error: any, response: any) => void,
  ) {
    try {
      this.logger.log(
        `[DEBUG] Recebido pedido para entrar na sala: ${roomName}`,
      );

      if (!roomName || typeof roomName !== 'string') {
        throw new Error('Nome da sala é obrigatório');
      }

      if (!roomName.startsWith(this.roomPrefix)) {
        this.logger.error(`Nome da sala inválido: ${roomName}`);
        if (callback) {
          callback({ message: 'Nome da sala inválido' }, null);
        } else {
          client.emit('room-join-error', { message: 'Nome da sala inválido' });
        }
        return;
      }

      const estabelecimentoId = roomName.replace(this.roomPrefix, '');

      // Adiciona o cliente à sala
      await client.join(roomName);

      // Busca solicitações existentes
      const solicitacoes =
        await this.solicitacaoMesaService.getSolicitacoesByEstabelecimento(
          estabelecimentoId,
        );

      const response = {
        room: roomName,
        solicitacoes: solicitacoes || [],
      };

      // IMPORTANTE: Emite resposta usando o callback se disponível
      if (callback) {
        callback(null, response);
      } else {
        client.emit('room-joined', response);
      }

      this.logger.log(
        `[DEBUG] Cliente ${client.id} entrou na sala: ${roomName}`,
      );

      // Atualiza registro de salas do cliente
      this.clientRooms.set(client.id, [roomName]);

      return { success: true, solicitacoes };
    } catch (error) {
      const message = getErrorMessage(error);
      this.logger.error(`[DEBUG] Erro ao entrar na sala: ${message}`);
      if (callback) {
        callback({ message }, null);
      } else {
        client.emit('room-join-error', { message });
      }
      throw error;
    }
  }

  @SubscribeMessage('solicitar-mesa')
  async handleSolicitarMesa(client: Socket, data: SolicitacaoMesaDto) {
    this.logger.log(
      `[DEBUG] Recebida solicitação de mesa: ${JSON.stringify(data)}`,
    );
    try {
      if (!data || !data.num_cnpj || !data.numMesa || !data.clienteId) {
        throw new Error('Dados da solicitação inválidos');
      }

      const solicitacao = await this.solicitacaoMesaService.solicitarMesa(data);

      // Envia confirmação para o cliente que fez a solicitação
      client.emit('solicitacao-recebida', {
        status: 'ok',
        data: solicitacao,
      });

      // Notifica todos na sala sobre a nova solicitação
      const roomName = `${this.roomPrefix}${data.num_cnpj}`;
      this.server.to(roomName).emit('nova-solicitacao', solicitacao);

      this.logger.log(
        `[DEBUG] Nova solicitação notificada para sala ${roomName}`,
      );

      return { success: true, solicitacao };
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      this.logger.error(
        `[DEBUG] Erro ao processar solicitação de mesa: ${message}`,
      );
      client.emit('solicitacao-recebida', {
        status: 'error',
        message,
      });
      throw error;
    }
  }

  getServer(): Server {
    return this.server;
  }
}
