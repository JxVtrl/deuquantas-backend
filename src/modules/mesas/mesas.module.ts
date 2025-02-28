import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mesa } from './mesa.entity';
import { MesaRepository } from './mesa.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Mesa])],
  providers: [MesaRepository],
  exports: [MesaRepository],
})
export class MesasModule {}
