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

  @Get(':numCnpj')
  @UseGuards(AuthGuard)
  async getEstabelecimentoByCnpj(@Param('numCnpj') numCnpj: string) {
    return this.estabelecimentoService.getEstabelecimentoByCnpj(numCnpj);
  }

  @Get('check-cnpj/:numCnpj')
  async checkCNPJ(
    @Param('numCnpj') numCnpj: string,
  ): Promise<{ exists: boolean }> {
    try {
      await this.estabelecimentoService.findByCNPJ(numCnpj);
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

  @Get('check-phone/:numCelular')
  async checkPhoneExists(@Param('numCelular') numCelular: string) {
    const exists =
      await this.estabelecimentoService.checkPhoneExists(numCelular);
    return { exists };
  }

  @Get('usuario/:usuarioId')
  @UseGuards(AuthGuard)
  async getEstabelecimentoByUsuarioId(@Param('usuarioId') usuarioId: string) {
    return this.estabelecimentoService.findByUsuarioId(usuarioId);
  }
}
