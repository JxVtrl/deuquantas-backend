import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Funcionario } from './funcionario.entity';
import { FuncionarioRepository } from './funcionario.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Funcionario])],
  providers: [FuncionarioRepository],
  exports: [FuncionarioRepository],
})
export class FuncionariosModule {}
