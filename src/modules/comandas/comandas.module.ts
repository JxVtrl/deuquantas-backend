import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comanda } from './comanda.entity';
import { TestComanda } from './test-comanda.entity';
import { ComandaRepository } from './comanda.repository';
import { TestComandaRepository } from './test-comanda.repository';
import { ComandaService } from './services/comanda.service';
import { TestComandaService } from './services/test-comanda.service';
import { ComandaController } from './controllers/comanda.controller';
import { ContasModule } from '../contas/contas.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comanda, TestComanda]), ContasModule],
  providers: [
    ComandaRepository,
    TestComandaRepository,
    ComandaService,
    TestComandaService,
  ],
  controllers: [ComandaController],
  exports: [ComandaRepository, TestComandaRepository, ComandaService],
})
export class ComandasModule {}
