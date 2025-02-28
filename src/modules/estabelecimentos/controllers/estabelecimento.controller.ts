import { Controller, Get } from '@nestjs/common';
import { EstabelecimentoService } from '../services/estabelecimento.service';

@Controller('estabelecimentos')
export class EstabelecimentoController {
  constructor(private readonly estabelecimentoService: EstabelecimentoService) {}

  @Get()
  async getAllEstabelecimentos() {
    return this.estabelecimentoService.getAllEstabelecimentos();
  }
}
