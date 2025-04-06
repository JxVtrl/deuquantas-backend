import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CardapioService } from '../services/cardapio.service';
import { CreateCardapioDto } from '../dtos/cardapio.dto';
import { AuthGuard } from '../../../auth/auth.guard';
import { RolesGuard } from '../../../auth/role.guard';

@Controller('cardapios')
export class CardapioController {
  constructor(private readonly cardapioService: CardapioService) {}

  @Get()
  async getAllCardapios() {
    return this.cardapioService.getAllCardapios();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  async createCardapio(@Body() createCardapioDto: CreateCardapioDto) {
    return this.cardapioService.createCardapio(createCardapioDto);
  }
}
