import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { MesaService } from '../services/mesa.service';
import { CreateMesaDto, UpdateMesaDto } from '../dtos/mesa.dto';
import { AuthGuard } from '../../../auth/auth.guard';
import { RolesGuard } from '../../../auth/role.guard';

@Controller('mesas')
@UseGuards(AuthGuard, RolesGuard)
export class MesaController {
  private readonly logger = new Logger(MesaController.name);

  constructor(private readonly mesaService: MesaService) {}

  @Get()
  async getAllMesas() {
    this.logger.log('Buscando todas as mesas');
    const mesas = await this.mesaService.getAllMesas();
    this.logger.log(`Encontradas ${mesas.length} mesas`);
    return mesas;
  }

  @Get('estabelecimento/:cnpj')
  async getMesasByEstabelecimento(@Param('cnpj') cnpj: string) {
    this.logger.log(`Buscando mesas do estabelecimento: ${cnpj}`);
    const mesas = await this.mesaService.getMesasByEstabelecimento(cnpj);
    this.logger.log(
      `Encontradas ${mesas.length} mesas para o estabelecimento: ${cnpj}`,
    );
    return mesas;
  }

  @Get(':numMesa')
  async getMesaByNumero(@Param('numMesa') numMesa: string) {
    this.logger.log(`Buscando mesa número: ${numMesa}`);
    const mesa = await this.mesaService.getMesaByNumero(numMesa);
    this.logger.log(
      `Mesa ${mesa ? 'encontrada' : 'não encontrada'} com número: ${numMesa}`,
    );
    return mesa;
  }

  @Post()
  async createMesa(@Body() createMesaDto: CreateMesaDto) {
    this.logger.log(
      `Criando nova mesa para o estabelecimento: ${createMesaDto.num_cnpj}`,
    );
    const mesa = await this.mesaService.createMesa(createMesaDto);
    this.logger.log(
      `Mesa criada com sucesso. Número: ${mesa.numMesa}, CNPJ: ${mesa.num_cnpj}`,
    );
    return mesa;
  }

  @Put(':numMesa')
  async updateMesa(
    @Param('numMesa') numMesa: string,
    @Body() updateMesaDto: UpdateMesaDto,
  ) {
    this.logger.log(`Atualizando mesa número: ${numMesa}`);
    const mesa = await this.mesaService.updateMesa(numMesa, updateMesaDto);
    this.logger.log(
      `Mesa atualizada com sucesso. Número: ${mesa.numMesa}, CNPJ: ${mesa.num_cnpj}`,
    );
    return mesa;
  }
}
