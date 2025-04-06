import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { FuncionarioService } from '../services/funcionario.service';
import { CreateFuncionarioDto } from '../dtos/funcionario.dto';
import { AuthGuard } from '../../../auth/auth.guard';
import { RolesGuard } from '../../../auth/role.guard';
import { Roles } from '../../../auth/roles.decorator';

@Controller('funcionarios')
@UseGuards(AuthGuard, RolesGuard)
export class FuncionarioController {
  constructor(private readonly funcionarioService: FuncionarioService) {}

  @Roles('gerente')
  @Get()
  async getAllFuncionarios() {
    return this.funcionarioService.getAllFuncionarios();
  }

  @Roles('gerente')
  @Get(':num_cpf')
  async getFuncionarioByCpf(@Param('num_cpf') num_cpf: string) {
    return this.funcionarioService.getFuncionarioByCpf(num_cpf);
  }

  @Roles('gerente')
  @Post()
  async createFuncionario(@Body() createFuncionarioDto: CreateFuncionarioDto) {
    return this.funcionarioService.createFuncionario(createFuncionarioDto);
  }
}
