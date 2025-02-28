import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comanda } from './comanda.entity';
import { ComandaRepository } from './comanda.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Comanda])],
  providers: [ComandaRepository],
  exports: [ComandaRepository],
})
export class ComandasModule {}
