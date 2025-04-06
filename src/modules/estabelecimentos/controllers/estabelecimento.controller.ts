import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { EstabelecimentoService } from '../services/estabelecimento.service';
import { CreateEstabelecimentoDto } from '../dtos/estabelecimento.dto';
import { AuthGuard } from '../../../auth/auth.guard';

@Controller('estabelecimentos')
export class EstabelecimentoController {
  constructor(
    private readonly estabelecimentoService: EstabelecimentoService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async getAllEstabelecimentos() {
    return this.estabelecimentoService.getAllEstabelecimentos();
  }

  @Get(':num_cnpj')
  @UseGuards(AuthGuard)
  async getEstabelecimentoByCnpj(@Param('num_cnpj') num_cnpj: string) {
    return this.estabelecimentoService.getEstabelecimentoByCnpj(num_cnpj);
  }

  @Get('check-cnpj/:num_cnpj')
  async checkCNPJ(
    @Param('num_cnpj') num_cnpj: string,
  ): Promise<{ exists: boolean }> {
    try {
      await this.estabelecimentoService.findByCNPJ(num_cnpj);
      return { exists: true };
    } catch (error) {
      console.error('Erro ao verificar CNPJ:', error);
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
    console.log(
      `📌 RECEBI REQUISIÇÃO: latitude=${latitude}, longitude=${longitude}, raioKm=${raioKm}`,
    );

    const resultado =
      await this.estabelecimentoService.buscarEstabelecimentosProximos(
        parseFloat(latitude),
        parseFloat(longitude),
        parseFloat(raioKm),
      );

    console.log('📌 ENVIANDO RESPOSTA:', resultado);
    return { estabelecimentos: resultado }; // 🔥 Retorna um JSON explícito
  }

  @Post()
  async createEstabelecimento(
    @Body() createEstabelecimentoDto: CreateEstabelecimentoDto,
  ) {
    return this.estabelecimentoService.createEstabelecimento(
      createEstabelecimentoDto,
    );
  }

  @Get('check-phone/:num_celular')
  async checkPhoneExists(@Param('num_celular') num_celular: string) {
    const exists =
      await this.estabelecimentoService.checkPhoneExists(num_celular);
    return { exists };
  }

  @Get('usuario/:usuarioId')
  @UseGuards(AuthGuard)
  async getEstabelecimentoByUsuarioId(@Param('usuarioId') usuarioId: string) {
    return this.estabelecimentoService.findByUsuarioId(usuarioId);
  }
}
