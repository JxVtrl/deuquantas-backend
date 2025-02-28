import { Controller } from '@nestjs/common';
import { ComandaService } from "../services/comanda.service";


@Controller('comandas')
export class ComandaController {
  constructor(private readonly comandaService: ComandaService) {}
}