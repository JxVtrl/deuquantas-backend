import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { MesaService } from '../services/mesa.service';
import { CreateMesaDto, UpdateMesaDto } from '../dtos/mesa.dto';
import { AuthGuard } from '../../../auth/auth.guard';
import { RolesGuard } from '../../../auth/role.guard';

@Controller('mesas')
@UseGuards(AuthGuard, RolesGuard)
export class MesaController {
  constructor(private readonly mesaService: MesaService) {}

  @Get()
  async getAllMesas() {
    return this.mesaService.getAllMesas();
  }

  @Get('estabelecimento/:cnpj')
  async getMesasByEstabelecimento(@Param('cnpj') cnpj: string) {
    return this.mesaService.getMesasByEstabelecimento(cnpj);
  }

  @Get(':numMesa')
  async getMesaByNumero(@Param('numMesa') numMesa: string) {
    return this.mesaService.getMesaByNumero(numMesa);
  }

  @Post()
  async createMesa(@Body() createMesaDto: CreateMesaDto) {
    return this.mesaService.createMesa(createMesaDto);
  }

  @Put(':numMesa')
  async updateMesa(
    @Param('numMesa') numMesa: string,
    @Body() updateMesaDto: UpdateMesaDto,
  ) {
    return this.mesaService.updateMesa(numMesa, updateMesaDto);
  }
}
