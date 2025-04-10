import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
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
    try {
      this.logger.log('Buscando todas as mesas');
      const mesas = await this.mesaService.getAllMesas();
      this.logger.log(`Encontradas ${mesas.length} mesas`);
      return {
        success: true,
        data: mesas,
      };
    } catch (error) {
      this.logger.error('Erro ao buscar todas as mesas:', error.stack);
      throw new InternalServerErrorException('Erro ao buscar mesas');
    }
  }

  @Get('estabelecimento/:cnpj')
  async getMesasByEstabelecimento(@Param('cnpj') cnpj: string) {
    try {
      this.logger.log(`Buscando mesas do estabelecimento: ${cnpj}`);
      const mesas = await this.mesaService.getMesasByEstabelecimento(cnpj);
      this.logger.log(
        `Encontradas ${mesas.length} mesas para o estabelecimento: ${cnpj}`,
      );
      return {
        success: true,
        data: mesas,
      };
    } catch (error) {
      this.logger.error(
        `Erro ao buscar mesas do estabelecimento ${cnpj}:`,
        error.stack,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Erro ao buscar mesas do estabelecimento',
      );
    }
  }

  @Get(':numMesa')
  async getMesaByNumero(@Param('numMesa') numMesa: string) {
    try {
      this.logger.log(`Buscando mesa número: ${numMesa}`);
      const mesa = await this.mesaService.getMesaByNumero(numMesa);
      this.logger.log(
        `Mesa ${mesa ? 'encontrada' : 'não encontrada'} com número: ${numMesa}`,
      );
      return {
        success: true,
        data: mesa,
      };
    } catch (error) {
      this.logger.error(`Erro ao buscar mesa ${numMesa}:`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao buscar mesa');
    }
  }

  @Post()
  async createMesa(@Body() createMesaDto: CreateMesaDto) {
    try {
      this.logger.log(
        `Criando nova mesa para o estabelecimento: ${createMesaDto.num_cnpj}`,
      );
      const mesa = await this.mesaService.createMesa(createMesaDto);
      this.logger.log(
        `Mesa criada com sucesso. Número: ${mesa.numMesa}, CNPJ: ${mesa.num_cnpj}`,
      );
      return {
        success: true,
        data: mesa,
      };
    } catch (error) {
      this.logger.error(
        `Erro ao criar mesa para o estabelecimento ${createMesaDto.num_cnpj}:`,
        error.stack,
      );
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao criar mesa');
    }
  }

  @Put(':numMesa')
  async updateMesa(
    @Param('numMesa') numMesa: string,
    @Body() updateMesaDto: UpdateMesaDto,
  ) {
    try {
      this.logger.log(`Atualizando mesa número: ${numMesa}`);
      const mesa = await this.mesaService.updateMesa(numMesa, updateMesaDto);
      this.logger.log(
        `Mesa atualizada com sucesso. Número: ${mesa.numMesa}, CNPJ: ${mesa.num_cnpj}`,
      );
      return {
        success: true,
        data: mesa,
      };
    } catch (error) {
      this.logger.error(`Erro ao atualizar mesa ${numMesa}:`, error.stack);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao atualizar mesa');
    }
  }

  @Delete(':numMesa')
  async deleteMesa(@Param('numMesa') numMesa: string) {
    try {
      this.logger.log(`Excluindo mesa número: ${numMesa}`);
      await this.mesaService.deleteMesa(numMesa);
      this.logger.log(`Mesa excluída com sucesso. Número: ${numMesa}`);
      return {
        success: true,
        message: 'Mesa excluída com sucesso',
      };
    } catch (error) {
      this.logger.error(`Erro ao excluir mesa ${numMesa}:`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao excluir mesa');
    }
  }
}
