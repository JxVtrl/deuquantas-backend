import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ComandaService } from '../services/comanda.service';
import { TestComandaService } from '../services/test-comanda.service';
import { CreateComandaDto } from '../dtos/comanda.dto';
import { AuthGuard } from '../../../auth/auth.guard';

@Controller('comandas')
export class ComandaController {
  constructor(
    private readonly comandaService: ComandaService,
    private readonly testComandaService: TestComandaService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async getAllComandas() {
    return this.comandaService.getAllComandas();
  }

  @Get('test')
  async getAllTestComandas() {
    return this.testComandaService.getAllTestComandas();
  }

  @Get(':numCpf')
  @UseGuards(AuthGuard)
  async getComandaByCpf(@Param('numCpf') numCpf: string) {
    return this.comandaService.getComandaByCpf(numCpf);
  }

  @Get('test/:numCpf')
  async getTestComandaByCpf(@Param('numCpf') numCpf: string) {
    return this.testComandaService.getTestComandaByCpf(numCpf);
  }

  @Post()
  async createComanda(@Body() createComandaDto: CreateComandaDto) {
    return this.comandaService.createComanda(createComandaDto);
  }
}
