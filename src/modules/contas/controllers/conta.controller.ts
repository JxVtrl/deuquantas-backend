import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ContaService } from '../services/conta.service';
import { CreateContaDto } from '../dtos/conta.dto';
import { AuthGuard } from '../../../auth/auth.guard';

@Controller('contas')
@UseGuards(AuthGuard) // Toda a rota de contas exige autenticação
export class ContaController {
  constructor(private readonly contaService: ContaService) {}

  @Get()
  async getAllContas() {
    return this.contaService.getAllContas();
  }

  @Get(':num_cpf')
  async getContaByCpf(@Param('num_cpf') num_cpf: string) {
    return this.contaService.getContaByCpf(num_cpf);
  }

  @Post()
  async createConta(@Body() createContaDto: CreateContaDto) {
    return this.contaService.createConta(createContaDto);
  }
}
