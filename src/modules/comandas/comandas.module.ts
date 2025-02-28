import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comanda } from './comanda.entity';
import { ComandaRepository } from './comanda.repository';
import { ComandaService } from './services/comanda.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comanda])],
  providers: [ComandaRepository, ComandaService],
  exports: [ComandaRepository],
})
export class ComandasModule {}
