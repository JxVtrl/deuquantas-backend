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
import { TestComandaService } from '../services/test-comanda.service';
import { CreateComandaDto } from '../dtos/comanda.dto';
import { AuthGuard } from '../../../auth/auth.guard';

@Controller('comandas')
export class ComandaController {
  private readonly logger = new Logger(ComandaController.name);

  constructor(
    private readonly comandaService: ComandaService,
    private readonly testComandaService: TestComandaService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async getAllComandas() {
    this.logger.log('Buscando todas as comandas');
    const comandas = await this.comandaService.getAllComandas();
    this.logger.log(`Encontradas ${comandas.length} comandas`);
    return comandas;
  }

  @Get('test')
  async getAllTestComandas() {
    this.logger.log('Buscando todas as comandas de teste');
    const comandas = await this.testComandaService.getAllTestComandas();
    this.logger.log(`Encontradas ${comandas.length} comandas de teste`);
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

  @Get(':num_cpf')
  @UseGuards(AuthGuard)
  async getComandaByCpf(@Param('num_cpf') num_cpf: string) {
    this.logger.log(`Buscando comanda para o CPF: ${num_cpf}`);
    const comanda = await this.comandaService.getComandaByCpf(num_cpf);
    this.logger.log(
      `Comanda ${comanda ? 'encontrada' : 'não encontrada'} para o CPF: ${num_cpf}`,
    );
    return comanda;
  }

  @Get('test/:num_cpf')
  async getTestComandaByCpf(@Param('num_cpf') num_cpf: string) {
    this.logger.log(`Buscando comanda de teste para o CPF: ${num_cpf}`);
    const comanda = await this.testComandaService.getTestComandaByCpf(num_cpf);
    this.logger.log(
      `Comanda de teste ${comanda ? 'encontrada' : 'não encontrada'} para o CPF: ${num_cpf}`,
    );
    return comanda;
  }

  @Get('id/:id')
  @UseGuards(AuthGuard)
  async getComandaById(@Param('id') id: string) {
    this.logger.log(`Buscando comanda por ID: ${id}`);
    const comanda = await this.comandaService.getComandaById(id);
    this.logger.log(`Comanda encontrada para o ID: ${id}`);
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
}
