import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comanda } from './comanda.entity';
import { ComandaItem } from './comanda-item.entity';
import { Item } from '../itens/item.entity';
import { Conta } from '../contas/conta.entity';
import { ContasModule } from '../contas/contas.module';
import { ComandaRepository } from './comanda.repository';
import { ComandaService } from './services/comanda.service';
import { ComandaController } from './controllers/comanda.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comanda, ComandaItem, Item, Conta]),
    ContasModule,
  ],
  providers: [ComandaRepository, ComandaService],
  controllers: [ComandaController],
  exports: [ComandaRepository, ComandaService],
})
export class ComandasModule {}
