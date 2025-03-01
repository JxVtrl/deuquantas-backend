import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MesaService } from '../services/mesa.service';
import { CreateMesaDto } from '../dtos/mesa.dto';

@Controller('mesas')
export class MesaController {
  constructor(private readonly mesaService: MesaService) {}

  @Get()
  async getAllMesas() {
    return this.mesaService.getAllMesas();
  }

  @Get(':numMesa')
  async getMesaByNumero(@Param('numMesa') numMesa: string) {
    return this.mesaService.getMesaByNumero(numMesa);
  }

  @Post()
  async createMesa(@Body() createMesaDto: CreateMesaDto) {
    return this.mesaService.createMesa(createMesaDto);
  }
}
