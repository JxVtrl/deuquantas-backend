import { Controller } from "@nestjs/common";
import { FuncionarioService } from "../services/funcionario.service";

@Controller('funcionarios')
export class FuncionarioController {
  constructor(private readonly funcionarioService: FuncionarioService) {}
}
