import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conta } from './conta.entity';
import { ContaRepository } from './conta.repository';
import { ContaService } from './services/conta.service';
import { ContaController } from './controllers/conta.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Conta])],
  providers: [ContaRepository, ContaService],
  controllers: [ContaController],
  exports: [ContaRepository],
})
export class ContasModule {}
