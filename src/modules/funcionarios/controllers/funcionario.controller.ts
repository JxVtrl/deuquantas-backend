import { Controller, Get, Post, Body, Param, UseGuards, Logger } from '@nestjs/common';
import { FuncionarioService } from '../services/funcionario.service';
import { CreateFuncionarioDto } from '../dtos/funcionario.dto';
import { AuthGuard } from '../../../auth/auth.guard';
import { RolesGuard } from '../../../auth/role.guard';

@Controller('funcionarios')
@UseGuards(AuthGuard, RolesGuard)
export class FuncionarioController {
  private readonly logger = new Logger(FuncionarioController.name);

  constructor(private readonly funcionarioService: FuncionarioService) {}

  @Get()
  async getAllFuncionarios() {
    this.logger.log('Buscando todos os funcionários');
    const funcionarios = await this.funcionarioService.getAllFuncionarios();
    this.logger.log(`Encontrados ${funcionarios.length} funcionários`);
    return funcionarios;
  }

  @Get(':num_cpf')
  async getFuncionarioByCpf(@Param('num_cpf') num_cpf: string) {
    this.logger.log(`Buscando funcionário com CPF: ${num_cpf}`);
    const funcionario = await this.funcionarioService.getFuncionarioByCpf(num_cpf);
    this.logger.log(`Funcionário ${funcionario ? 'encontrado' : 'não encontrado'} com CPF: ${num_cpf}`);
    return funcionario;
  }

  @Post()
  async createFuncionario(@Body() createFuncionarioDto: CreateFuncionarioDto) {
    this.logger.log(`Criando novo funcionário com CPF: ${createFuncionarioDto.num_cpf}`);
    const funcionario = await this.funcionarioService.createFuncionario(createFuncionarioDto);
    this.logger.log(`Funcionário criado com sucesso. CPF: ${funcionario.num_cpf}`);
    return funcionario;
  }
}
