import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { FuncionarioService } from '../services/funcionario.service';
import { CreateFuncionarioDto } from '../dtos/funcionario.dto';
import { AuthGuard } from '../../../auth/auth.guard';
import { RolesGuard } from '../../../auth/role.guard';

@Controller('funcionarios')
@UseGuards(AuthGuard, RolesGuard)
export class FuncionarioController {
  constructor(private readonly funcionarioService: FuncionarioService) {}

  @Get()
  async getAllFuncionarios() {
    return this.funcionarioService.getAllFuncionarios();
  }

  @Get(':num_cpf')
  async getFuncionarioByCpf(@Param('num_cpf') num_cpf: string) {
    return this.funcionarioService.getFuncionarioByCpf(num_cpf);
  }

  @Post()
  async createFuncionario(@Body() createFuncionarioDto: CreateFuncionarioDto) {
    return this.funcionarioService.createFuncionario(createFuncionarioDto);
  }
}
