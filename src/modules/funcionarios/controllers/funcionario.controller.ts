import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { FuncionarioService } from '../services/funcionario.service';
import { CreateFuncionarioDto } from '../dtos/funcionario.dto';
import { JwtAuthGuard } from '../../../auth/auth.guard';
import { RoleGuard } from '../../../auth/role.guard';
import { Roles } from '../../../auth/roles.decorator';

@Controller('funcionarios')
@UseGuards(JwtAuthGuard, RoleGuard)
export class FuncionarioController {
  constructor(private readonly funcionarioService: FuncionarioService) {}

  @Roles('gerente')
  @Get()
  async getAllFuncionarios() {
    return this.funcionarioService.getAllFuncionarios();
  }

  @Roles('gerente')
  @Get(':numCpf')
  async getFuncionarioByCpf(@Param('numCpf') numCpf: string) {
    return this.funcionarioService.getFuncionarioByCpf(numCpf);
  }

  @Roles('gerente')
  @Post()
  async createFuncionario(@Body() createFuncionarioDto: CreateFuncionarioDto) {
    return this.funcionarioService.createFuncionario(createFuncionarioDto);
  }
}
