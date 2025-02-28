import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Funcionario } from './funcionario.entity';
import { FuncionarioRepository } from './funcionario.repository';
import { FuncionarioController } from './controllers/funcionario.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Funcionario])],
  providers: [FuncionarioRepository],
  controllers: [FuncionarioController],
  exports: [FuncionarioRepository],
})
export class FuncionariosModule {}
