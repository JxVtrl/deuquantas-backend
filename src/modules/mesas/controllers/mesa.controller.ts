import { Controller } from "@nestjs/common";
import { MesaService } from "../services/mesa.service";

@Controller('mesas')
export class MesaController {
  constructor(private readonly mesaService: MesaService) {}
}
