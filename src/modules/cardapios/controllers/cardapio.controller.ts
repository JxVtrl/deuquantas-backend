import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CardapioService } from '../services/cardapio.service';
import { CreateCardapioDto } from '../dtos/cardapio.dto';

@Controller('cardapios')
export class CardapioController {
  constructor(private readonly cardapioService: CardapioService) {}

  @Get()
  async getAllCardapios() {
    return this.cardapioService.getAllCardapios();
  }

  @Get(':numCnpj')
  async getCardapioByCnpj(@Param('numCnpj') numCnpj: string) {
    return this.cardapioService.getCardapioByCnpj(numCnpj);
  }

  @Post()
  async createCardapio(@Body() createCardapioDto: CreateCardapioDto) {
    return this.cardapioService.createCardapio(createCardapioDto);
  }
}
