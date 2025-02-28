import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mesa } from './mesa.entity';
import { MesaRepository } from './mesa.repository';
import { MesaService } from './services/mesa.service';

@Module({
  imports: [TypeOrmModule.forFeature([Mesa])],
  providers: [MesaRepository, MesaService],
  exports: [MesaRepository],
})
export class MesasModule {}
