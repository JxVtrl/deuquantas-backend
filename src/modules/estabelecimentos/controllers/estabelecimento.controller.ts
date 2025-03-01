import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { EstabelecimentoService } from '../services/estabelecimento.service';
import { CreateEstabelecimentoDto } from '../dtos/estabelecimento.dto';

@Controller('estabelecimentos')
export class EstabelecimentoController {
  constructor(private readonly estabelecimentoService: EstabelecimentoService) {}

  @Get()
  async getAllEstabelecimentos() {
    return this.estabelecimentoService.getAllEstabelecimentos();
  }

  @Get(':numCnpj')
  async getEstabelecimentoByCnpj(@Param('numCnpj') numCnpj: string) {
    return this.estabelecimentoService.getEstabelecimentoByCnpj(numCnpj);
  }

  @Post()
  async createEstabelecimento(@Body() createEstabelecimentoDto: CreateEstabelecimentoDto) {
    return this.estabelecimentoService.createEstabelecimento(createEstabelecimentoDto);
  }
}
