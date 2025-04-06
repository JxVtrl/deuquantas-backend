import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from '../clientes/cliente.entity';
import { Estabelecimento } from '../estabelecimentos/estabelecimento.entity';
import { TestDataService } from './test-data.service';
import { TestDataController } from './test-data.controller';
import { Usuario } from '../usuarios/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Cliente, Estabelecimento])],
  controllers: [TestDataController],
  providers: [TestDataService],
})
export class TestDataModule {}
