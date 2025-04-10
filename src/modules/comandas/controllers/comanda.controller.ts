import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ComandaService } from '../services/comanda.service';
import { CreateComandaDto } from '../dtos/comanda.dto';
import { AuthGuard } from '../../../auth/auth.guard';

@Controller('comandas')
export class ComandaController {
  private readonly logger = new Logger(ComandaController.name);

  constructor(private readonly comandaService: ComandaService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getAllComandas() {
    this.logger.log('Buscando todas as comandas');
    const comandas = await this.comandaService.getAllComandas();
    this.logger.log(`Encontradas ${comandas.length} comandas`);
    return comandas;
  }

  @Get('ativa/:num_cpf')
  @UseGuards(AuthGuard)
  async getComandaAtivaByCpf(@Param('num_cpf') num_cpf: string) {
    this.logger.log(`Buscando comanda ativa para o CPF: ${num_cpf}`);
    const comanda = await this.comandaService.getComandaAtivaByCpf(num_cpf);
    this.logger.log(
      `Comanda ativa ${comanda ? 'encontrada' : 'não encontrada'} para o CPF: ${num_cpf}`,
    );
    return comanda;
  }

  @Get('cpf/:num_cpf')
  @UseGuards(AuthGuard)
  async getComandaByCpf(@Param('num_cpf') num_cpf: string) {
    this.logger.log(`Buscando comanda para o CPF: ${num_cpf}`);
    const comanda = await this.comandaService.getComandaByCpf(num_cpf);
    this.logger.log(
      `Comanda ${comanda ? 'encontrada' : 'não encontrada'} para o CPF: ${num_cpf}`,
    );
    return comanda;
  }

  @Post()
  async createComanda(@Body() createComandaDto: CreateComandaDto) {
    this.logger.log(
      `Criando nova comanda para o CPF: ${createComandaDto.num_cpf}`,
    );
    const comanda = await this.comandaService.createComanda(createComandaDto);
    this.logger.log(
      `Comanda criada com sucesso para o CPF: ${createComandaDto.num_cpf}`,
    );
    return comanda;
  }

  @Post('ativar/:num_cpf')
  @UseGuards(AuthGuard)
  async ativarComanda(@Param('num_cpf') num_cpf: string) {
    this.logger.log(`Ativando comanda para o CPF: ${num_cpf}`);
    const comanda = await this.comandaService.ativarComanda(num_cpf);
    this.logger.log(
      `Comanda ${comanda ? 'ativada' : 'não encontrada'} para o CPF: ${num_cpf}`,
    );
    return comanda;
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getComandaById(@Param('id') id: string) {
    this.logger.log(`Buscando comanda por ID: ${id}`);
    try {
      const comanda = await this.comandaService.getComandaById(id);
      this.logger.log(`Comanda encontrada para o ID: ${id}`, { comanda });
      return comanda;
    } catch (error) {
      this.logger.error(`Erro ao buscar comanda por ID: ${id}`, error);
      throw error;
    }
  }
}
