import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estabelecimento } from './estabelecimento.entity';
import { EstabelecimentoRepository } from './estabelecimento.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Estabelecimento])],
  providers: [EstabelecimentoRepository],
  exports: [EstabelecimentoRepository],
})
export class EstabelecimentosModule {}
