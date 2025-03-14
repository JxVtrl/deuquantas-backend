import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { MesaService } from '../services/mesa.service';
import { CreateMesaDto } from '../dtos/mesa.dto';
import { AuthGuard } from '../../../auth/auth.guard';
import { RolesGuard } from '../../../auth/role.guard';
import { Roles } from '../../../auth/roles.decorator';

@Controller('mesas')
@UseGuards(AuthGuard, RolesGuard) // Exige autenticação para todas as rotas
export class MesaController {
  constructor(private readonly mesaService: MesaService) {}

  @Roles('funcionario', 'gerente')
  @Get()
  async getAllMesas() {
    return this.mesaService.getAllMesas();
  }

  @Roles('funcionario', 'gerente')
  @Get(':numMesa')
  async getMesaByNumero(@Param('numMesa') numMesa: string) {
    return this.mesaService.getMesaByNumero(numMesa);
  }

  @Roles('funcionario', 'gerente')
  @Post()
  async createMesa(@Body() createMesaDto: CreateMesaDto) {
    return this.mesaService.createMesa(createMesaDto);
  }
}
