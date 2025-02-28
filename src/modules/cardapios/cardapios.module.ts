import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cardapio } from './cardapio.entity';
import { CardapioRepository } from './cardapio.repository';
import { CardapioService } from './services/cardapio.service';
import { CardapioController } from './controllers/cardapio.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cardapio])],
  providers: [CardapioRepository, CardapioService],
  controllers: [CardapioController],
  exports: [CardapioRepository],
})
export class CardapiosModule {}
