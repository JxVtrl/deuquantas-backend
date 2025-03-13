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
import { JwtAuthGuard } from '../../../auth/auth.guard';
import { RoleGuard } from '../../../auth/role.guard';
import { Roles } from '../../../auth/roles.decorator';

@Controller('estabelecimentos')
export class EstabelecimentoController {
  constructor(
    private readonly estabelecimentoService: EstabelecimentoService,
  ) {}

  @Get()
  async getAllEstabelecimentos() {
    return this.estabelecimentoService.getAllEstabelecimentos();
  }

  @Get(':numCnpj')
  async getEstabelecimentoByCnpj(@Param('numCnpj') numCnpj: string) {
    return this.estabelecimentoService.getEstabelecimentoByCnpj(numCnpj);
  }

  @Get('proximos')
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

  @Roles('gerente')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  async createEstabelecimento(
    @Body() createEstabelecimentoDto: CreateEstabelecimentoDto,
  ) {
    return this.estabelecimentoService.createEstabelecimento(
      createEstabelecimentoDto,
    );
  }
}
