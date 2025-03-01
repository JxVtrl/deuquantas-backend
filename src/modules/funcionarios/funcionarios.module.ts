import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Funcionario } from './funcionario.entity';
import { FuncionarioRepository } from './funcionario.repository';
import { FuncionarioController } from './controllers/funcionario.controller';
import { FuncionarioService } from './services/funcionario.service';

@Module({
  imports: [TypeOrmModule.forFeature([Funcionario])],
  providers: [FuncionarioRepository, FuncionarioService],
  controllers: [FuncionarioController],
  exports: [FuncionarioService],
})
export class FuncionariosModule {}
