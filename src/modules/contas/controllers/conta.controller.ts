import { Controller } from "@nestjs/common";
import { ContaService } from "../services/conta.service";

@Controller('contas')
export class ContaController {
  constructor(private readonly contaService: ContaService) {}
}