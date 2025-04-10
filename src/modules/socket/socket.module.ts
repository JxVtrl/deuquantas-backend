import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocketGateway } from './socket.gateway';
import { SolicitacaoMesa } from '../mesas/entities/solicitacao-mesa.entity';
import { Mesa } from '../mesas/mesa.entity';
import { Comanda } from '../comandas/comanda.entity';
import { MesasModule } from '../mesas/mesas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SolicitacaoMesa, Mesa, Comanda]),
    forwardRef(() => MesasModule),
  ],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
