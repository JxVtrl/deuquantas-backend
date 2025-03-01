import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FuncionarioService } from '../services/funcionario.service';
import { CreateFuncionarioDto } from '../dtos/funcionario.dto';

@Controller('funcionarios')
export class FuncionarioController {
  constructor(private readonly funcionarioService: FuncionarioService) {}

  @Get()
  async getAllFuncionarios() {
    return this.funcionarioService.getAllFuncionarios();
  }

  @Get(':numCpf')
  async getFuncionarioByCpf(@Param('numCpf') numCpf: string) {
    return this.funcionarioService.getFuncionarioByCpf(numCpf);
  }

  @Post()
  async createFuncionario(@Body() createFuncionarioDto: CreateFuncionarioDto) {
    return this.funcionarioService.createFuncionario(createFuncionarioDto);
  }
}
