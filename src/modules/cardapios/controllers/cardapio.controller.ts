import { Controller, Get, Post, Body, UseGuards, Logger } from '@nestjs/common';
import { CardapioService } from '../services/cardapio.service';
import { CreateCardapioDto } from '../dtos/cardapio.dto';
import { AuthGuard } from '../../../auth/auth.guard';
import { RolesGuard } from '../../../auth/role.guard';

@Controller('cardapios')
export class CardapioController {
  private readonly logger = new Logger(CardapioController.name);

  constructor(private readonly cardapioService: CardapioService) {}

  @Get()
  async getAllCardapios() {
    this.logger.log('Buscando todos os cardápios');
    const cardapios = await this.cardapioService.getAllCardapios();
    this.logger.log(`Encontrados ${cardapios.length} cardápios`);
    return cardapios;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  async createCardapio(@Body() createCardapioDto: CreateCardapioDto) {
    this.logger.log(
      `Criando novo cardápio para CNPJ: ${createCardapioDto.num_cnpj}`,
    );
    const cardapio =
      await this.cardapioService.createCardapio(createCardapioDto);
    this.logger.log(
      `Cardápio criado com sucesso. CNPJ: ${cardapio.num_cnpj}, Ordem: ${cardapio.numOrdem}`,
    );
    return cardapio;
  }
}
