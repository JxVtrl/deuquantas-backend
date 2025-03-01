import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ComandaService } from '../services/comanda.service';
import { CreateComandaDto } from '../dtos/comanda.dto';
import { JwtAuthGuard } from '../../../auth/auth.guard';

@Controller('comandas')
@UseGuards(JwtAuthGuard) // Toda a rota de comandas exige autenticação
export class ComandaController {
  constructor(private readonly comandaService: ComandaService) {}

  @Get()
  async getAllComandas() {
    return this.comandaService.getAllComandas();
  }

  @Get(':numCpf')
  async getComandaByCpf(@Param('numCpf') numCpf: string) {
    return this.comandaService.getComandaByCpf(numCpf);
  }

  @Post()
  async createComanda(@Body() createComandaDto: CreateComandaDto) {
    return this.comandaService.createComanda(createComandaDto);
  }
}
