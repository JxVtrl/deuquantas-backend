import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cardapio } from './cardapio.entity';
import { CardapioRepository } from './cardapio.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Cardapio])],
  providers: [CardapioRepository],
  exports: [CardapioRepository],
})
export class CardapiosModule {}
