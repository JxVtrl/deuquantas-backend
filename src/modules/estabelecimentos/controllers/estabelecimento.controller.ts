import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Logger,
} from '@nestjs/common';
import { EstabelecimentoService } from '../services/estabelecimento.service';
import { CreateEstabelecimentoDto } from '../dtos/estabelecimento.dto';
import { AuthGuard } from '../../../auth/auth.guard';

@Controller('estabelecimentos')
export class EstabelecimentoController {
  private readonly logger = new Logger(EstabelecimentoController.name);

  constructor(
    private readonly estabelecimentoService: EstabelecimentoService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async getAllEstabelecimentos() {
    this.logger.log('Buscando todos os estabelecimentos');
    const estabelecimentos =
      await this.estabelecimentoService.getAllEstabelecimentos();
    this.logger.log(`Encontrados ${estabelecimentos.length} estabelecimentos`);
    return estabelecimentos;
  }

  @Get('usuario/:usuarioId')
  @UseGuards(AuthGuard)
  async getEstabelecimentoByUsuarioId(@Param('usuarioId') usuarioId: string) {
    this.logger.log(`Buscando estabelecimento para o usuário: ${usuarioId}`);
    try {
      const estabelecimento =
        await this.estabelecimentoService.getEstabelecimentoByUsuarioId(
          usuarioId,
        );
      this.logger.log(
        `Estabelecimento encontrado para o usuário: ${usuarioId}`,
      );
      return {
        success: true,
        data: estabelecimento,
      };
    } catch (error) {
      this.logger.error(
        `Erro ao buscar estabelecimento para o usuário ${usuarioId}:`,
        error.stack,
      );
      throw error;
    }
  }

  @Get(':num_cnpj')
  @UseGuards(AuthGuard)
  async getEstabelecimentoByCnpj(@Param('num_cnpj') num_cnpj: string) {
    this.logger.log(`Buscando estabelecimento para o CNPJ: ${num_cnpj}`);
    const estabelecimento =
      await this.estabelecimentoService.getEstabelecimentoByCnpj(num_cnpj);
    this.logger.log(
      `Estabelecimento ${estabelecimento ? 'encontrado' : 'não encontrado'} para o CNPJ: ${num_cnpj}`,
    );
    return estabelecimento;
  }

  @Get('check-cnpj/:num_cnpj')
  async checkCNPJ(
    @Param('num_cnpj') num_cnpj: string,
  ): Promise<{ exists: boolean }> {
    this.logger.log(`Verificando existência do CNPJ: ${num_cnpj}`);
    try {
      await this.estabelecimentoService.findByCNPJ(num_cnpj);
      this.logger.log(`CNPJ ${num_cnpj} encontrado`);
      return { exists: true };
    } catch (error) {
      this.logger.error(`Erro ao verificar CNPJ ${num_cnpj}:`, error);
      return { exists: false };
    }
  }

  @Get('proximos')
  @UseGuards(AuthGuard)
  async buscarEstabelecimentosProximos(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
    @Query('raioKm') raioKm: string = '5',
  ) {
    this.logger.log(
      `Buscando estabelecimentos próximos - latitude: ${latitude}, longitude: ${longitude}, raio: ${raioKm}km`,
    );

    const resultado =
      await this.estabelecimentoService.buscarEstabelecimentosProximos(
        parseFloat(latitude),
        parseFloat(longitude),
        parseFloat(raioKm),
      );

    this.logger.log(
      `Encontrados ${resultado.length} estabelecimentos próximos`,
    );
    return { estabelecimentos: resultado };
  }

  @Post()
  async createEstabelecimento(
    @Body() createEstabelecimentoDto: CreateEstabelecimentoDto,
  ) {
    this.logger.log(
      `Criando novo estabelecimento para o CNPJ: ${createEstabelecimentoDto.num_cnpj}`,
    );
    const estabelecimento =
      await this.estabelecimentoService.createEstabelecimento(
        createEstabelecimentoDto,
      );
    this.logger.log(
      `Estabelecimento criado com sucesso para o CNPJ: ${createEstabelecimentoDto.num_cnpj}`,
    );
    return estabelecimento;
  }

  @Get('check-phone/:num_celular')
  async checkPhoneExists(@Param('num_celular') num_celular: string) {
    this.logger.log(`Verificando existência do telefone: ${num_celular}`);
    const exists =
      await this.estabelecimentoService.checkPhoneExists(num_celular);
    this.logger.log(
      `Telefone ${num_celular} ${exists ? 'existe' : 'não existe'} no sistema`,
    );
    return { exists };
  }
}
