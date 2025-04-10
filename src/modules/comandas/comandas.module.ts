import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comanda } from './comanda.entity';
import { ComandaRepository } from './comanda.repository';
import { ComandaService } from './services/comanda.service';
import { ComandaController } from './controllers/comanda.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Comanda])],
  providers: [ComandaRepository, ComandaService],
  controllers: [ComandaController],
  exports: [ComandaRepository, ComandaService],
})
export class ComandasModule {}
