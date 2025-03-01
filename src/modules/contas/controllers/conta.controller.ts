import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ContaService } from '../services/conta.service';
import { CreateContaDto } from '../dtos/conta.dto';
import { JwtAuthGuard } from '../../../auth/auth.guard';

@Controller('contas')
@UseGuards(JwtAuthGuard) // Toda a rota de contas exige autenticação
export class ContaController {
  constructor(private readonly contaService: ContaService) {}

  @Get()
  async getAllContas() {
    return this.contaService.getAllContas();
  }

  @Get(':numCpf')
  async getContaByCpf(@Param('numCpf') numCpf: string) {
    return this.contaService.getContaByCpf(numCpf);
  }

  @Post()
  async createConta(@Body() createContaDto: CreateContaDto) {
    return this.contaService.createConta(createContaDto);
  }
}
