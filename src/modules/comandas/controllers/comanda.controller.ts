import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ComandaService } from '../services/comanda.service';
import { CreateComandaDto } from '../dtos/comanda.dto';

@Controller('comandas')
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
