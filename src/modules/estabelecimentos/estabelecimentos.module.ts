import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estabelecimento } from './estabelecimento.entity';
import { EstabelecimentoRepository } from './estabelecimento.repository';
import { EstabelecimentoService } from './services/estabelecimento.service';
import { EstabelecimentoController } from './controllers/estabelecimento.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Estabelecimento])],
  providers: [EstabelecimentoRepository, EstabelecimentoService],
  controllers: [EstabelecimentoController],
  exports: [EstabelecimentoService, EstabelecimentoRepository],
})
export class EstabelecimentosModule {}
