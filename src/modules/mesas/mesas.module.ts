import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mesa } from './mesa.entity';
import { MesaRepository } from './mesa.repository';
import { MesaService } from './services/mesa.service';
import { MesaController } from './controllers/mesa.controller';
import { SolicitacaoMesa } from './entities/solicitacao-mesa.entity';
import { SolicitacaoMesaRepository } from './repositories/solicitacao-mesa.repository';
import { SolicitacaoMesaService } from './services/solicitacao-mesa.service';
import { SolicitacaoMesaController } from './controllers/solicitacao-mesa.controller';
import { SocketModule } from '../socket/socket.module';
import { ComandasModule } from '../comandas/comandas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mesa, SolicitacaoMesa]),
    SocketModule,
    ComandasModule,
  ],
  providers: [
    MesaRepository,
    MesaService,
    SolicitacaoMesaRepository,
    SolicitacaoMesaService,
  ],
  controllers: [MesaController, SolicitacaoMesaController],
  exports: [MesaRepository, SolicitacaoMesaRepository],
})
export class MesasModule {}
