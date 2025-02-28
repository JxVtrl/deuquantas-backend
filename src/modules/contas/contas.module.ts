import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conta } from './conta.entity';
import { ContaRepository } from './conta.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Conta])],
  providers: [ContaRepository],
  exports: [ContaRepository],
})
export class ContasModule {}
