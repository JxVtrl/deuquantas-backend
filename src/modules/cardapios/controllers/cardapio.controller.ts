import { Controller } from '@nestjs/common';
import { CardapioService } from "../services/cardapio.service";

@Controller('cardapios')
export class CardapioController {
  constructor(private readonly cardapioService: CardapioService) {}
}
