import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estabelecimento } from './estabelecimento.entity';
import { EstabelecimentoRepository } from './estabelecimento.repository';
import { EstabelecimentoService } from './services/estabelecimento.service';


@Module({
  imports: [TypeOrmModule.forFeature([Estabelecimento])],
  providers: [EstabelecimentoRepository, EstabelecimentoService],
  exports: [EstabelecimentoRepository],
})
export class EstabelecimentosModule {}
