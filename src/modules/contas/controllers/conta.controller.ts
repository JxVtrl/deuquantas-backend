import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ContaService } from '../services/conta.service';
import { CreateContaDto } from '../dtos/conta.dto';
import { AuthGuard } from '../../../auth/auth.guard';

@Controller('contas')
@UseGuards(AuthGuard) // Toda a rota de contas exige autenticação
export class ContaController {
  private readonly logger = new Logger(ContaController.name);

  constructor(private readonly contaService: ContaService) {}

  @Get()
  async getAllContas() {
    this.logger.log('Buscando todas as contas');
    const contas = await this.contaService.getAllContas();
    this.logger.log(`Encontradas ${contas.length} contas`);
    return contas;
  }

  @Get(':num_cpf')
  async getContaByCpf(@Param('num_cpf') num_cpf: string) {
    this.logger.log(`Buscando conta para o CPF: ${num_cpf}`);
    const conta = await this.contaService.getContaByCpf(num_cpf);
    this.logger.log(
      `Conta ${conta ? 'encontrada' : 'não encontrada'} para o CPF: ${num_cpf}`,
    );
    return conta;
  }

  @Post()
  async createConta(@Body() createContaDto: CreateContaDto) {
    this.logger.log(`Criando nova conta para o CPF: ${createContaDto.num_cpf}`);
    const conta = await this.contaService.createConta(createContaDto);
    this.logger.log(`Conta criada com sucesso para o CPF: ${conta.num_cpf}`);
    return conta;
  }
}
