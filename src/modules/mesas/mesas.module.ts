import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mesa } from './mesa.entity';
import { SolicitacaoMesa } from './entities/solicitacao-mesa.entity';
import { Comanda } from '../comandas/comanda.entity';
import { MesaRepository } from './mesa.repository';
import { SolicitacaoMesaRepository } from './repositories/solicitacao-mesa.repository';
import { ComandaRepository } from '../comandas/comanda.repository';
import { MesaController } from './controllers/mesa.controller';
import { QrCodeController } from './controllers/qr-code.controller';
import { SolicitacaoMesaController } from './controllers/solicitacao-mesa.controller';
import { MesaService } from './services/mesa.service';
import { SolicitacaoMesaService } from './services/solicitacao-mesa.service';
import { QrCodeService } from './services/qr-code.service';
import { Estabelecimento } from '../estabelecimentos/estabelecimento.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mesa, SolicitacaoMesa, Comanda, Estabelecimento]),
    TypeOrmModule.forFeature([Mesa], 'default'),
  ],
  controllers: [MesaController, QrCodeController, SolicitacaoMesaController],
  providers: [
    MesaService,
    SolicitacaoMesaService,
    MesaRepository,
    SolicitacaoMesaRepository,
    ComandaRepository,
    QrCodeService,
  ],
  exports: [MesaService, SolicitacaoMesaService, QrCodeService],
})
export class MesasModule {}
