import { Injectable, Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SocketGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`[DEBUG] Cliente conectado: ${client.id}`);
    this.logger.log(
      `[DEBUG] Handshake auth: ${JSON.stringify(client.handshake.auth)}`,
    );
    this.logger.log(`[DEBUG] Salas atuais: ${Array.from(client.rooms)}`);
    this.logger.log(
      `[DEBUG] Número total de clientes conectados: ${this.server.engine.clientsCount}`,
    );
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`[DEBUG] Cliente desconectado: ${client.id}`);
    this.logger.log(
      `[DEBUG] Salas antes de desconectar: ${Array.from(client.rooms)}`,
    );
    this.logger.log(
      `[DEBUG] Número total de clientes restantes: ${this.server.engine.clientsCount}`,
    );

    // Remover cliente de todas as salas ao desconectar
    const rooms = Array.from(client.rooms);
    rooms.forEach((room) => {
      if (room !== client.id) {
        // Não remover da sala padrão do cliente
        client.leave(room);
        this.logger.log(
          `[DEBUG] Cliente ${client.id} removido da sala ${room}`,
        );
      }
    });
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, room: string) {
    this.logger.log(
      `[DEBUG] Cliente ${client.id} tentando entrar na sala ${room}`,
    );
    this.logger.log(
      `[DEBUG] Dados do cliente: ${JSON.stringify(client.handshake.auth)}`,
    );
    this.logger.log(
      `[DEBUG] Salas atuais do cliente antes de entrar: ${Array.from(client.rooms)}`,
    );

    // Verificar se a sala tem o prefixo correto para estabelecimentos
    if (room.startsWith('estabelecimento:')) {
      client.join(room);
      this.logger.log(`[DEBUG] Cliente ${client.id} entrou na sala ${room}`);
      this.logger.log(
        `[DEBUG] Salas atuais do cliente após entrar: ${Array.from(client.rooms)}`,
      );
      this.logger.log(
        `[DEBUG] Clientes na sala ${room}: ${this.server.sockets.adapter.rooms.get(room)?.size || 0}`,
      );

      // Emitir evento de confirmação
      client.emit('room-joined', { room, status: 'ok' });
      return { status: 'ok', room };
    } else {
      this.logger.warn(
        `[DEBUG] Tentativa de entrar em sala com formato inválido: ${room}`,
      );
      client.emit('room-join-error', {
        status: 'error',
        message: 'Formato de sala inválido',
      });
      return { status: 'error', message: 'Formato de sala inválido' };
    }
  }

  getServer(): Server {
    return this.server;
  }
}
