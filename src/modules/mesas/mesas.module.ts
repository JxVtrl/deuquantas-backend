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
import { ComandasModule } from '../comandas/comandas.module';
import { QrCodeService } from './services/qr-code.service';
import { EstabelecimentosModule } from '../estabelecimentos/estabelecimentos.module';
import { Estabelecimento } from '../estabelecimentos/estabelecimento.entity';
import { Comanda } from '../comandas/comanda.entity';
import { QrCodeController } from './controllers/qr-code.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mesa, SolicitacaoMesa, Estabelecimento, Comanda]),
    ComandasModule,
    EstabelecimentosModule,
  ],
  providers: [
    MesaRepository,
    MesaService,
    SolicitacaoMesaRepository,
    SolicitacaoMesaService,
    QrCodeService,
  ],
  controllers: [MesaController, SolicitacaoMesaController, QrCodeController],
  exports: [MesaRepository, SolicitacaoMesaRepository, SolicitacaoMesaService],
})
export class MesasModule {}
