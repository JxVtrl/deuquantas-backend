import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SolicitacaoMesaService } from '../services/solicitacao-mesa.service';
import { SolicitacaoMesaDto } from '../dtos/solicitacao-mesa.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('solicitacoes-mesa')
@UseGuards(AuthGuard('jwt'))
export class SolicitacaoMesaController {
  private readonly logger = new Logger(SolicitacaoMesaController.name);

  constructor(
    private readonly solicitacaoMesaService: SolicitacaoMesaService,
  ) {}

  @Get('estabelecimento/:cnpj')
  async getSolicitacoesByEstabelecimento(@Param('cnpj') cnpj: string) {
    try {
      this.logger.log(`Buscando solicitações do estabelecimento: ${cnpj}`);
      const solicitacoes =
        await this.solicitacaoMesaService.getSolicitacoesByEstabelecimento(
          cnpj,
        );
      this.logger.log(
        `Encontradas ${solicitacoes.length} solicitações para o estabelecimento: ${cnpj}`,
      );
      return {
        success: true,
        data: solicitacoes,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Erro ao buscar solicitações:', error.stack);
      }
      throw new InternalServerErrorException('Erro ao buscar solicitações');
    }
  }

  @Get(':id')
  async getSolicitacaoById(@Param('id') id: string) {
    try {
      this.logger.log(`Buscando solicitação: ${id}`);
      const solicitacao =
        await this.solicitacaoMesaService.getSolicitacaoById(id);
      if (!solicitacao) {
        this.logger.error(`Solicitação não encontrada: ${id}`);
        throw new NotFoundException('Solicitação não encontrada');
      }
      this.logger.log(`Solicitação encontrada: ${JSON.stringify(solicitacao)}`);
      return {
        success: true,
        data: solicitacao,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Erro ao buscar solicitação:', error.stack);
      }
      throw new InternalServerErrorException('Erro ao buscar solicitação');
    }
  }

  @Post()
  async solicitarMesa(@Body() data: SolicitacaoMesaDto) {
    try {
      this.logger.log(`Criando solicitação: ${JSON.stringify(data)}`);
      const solicitacao =
        await this.solicitacaoMesaService.solicitarMesa(data);
      this.logger.log(
        `Solicitação criada com sucesso: ${JSON.stringify(solicitacao)}`,
      );
      return {
        success: true,
        data: solicitacao,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Erro ao criar solicitação:', error.stack);
      }
      throw new InternalServerErrorException('Erro ao criar solicitação');
    }
  }

  @Post(':id/aprovar')
  async aprovarSolicitacao(@Param('id') id: string) {
    try {
      this.logger.log(`Aprovando solicitação: ${id}`);
      const solicitacao =
        await this.solicitacaoMesaService.aprovarSolicitacao(id);
      this.logger.log(
        `Solicitação aprovada com sucesso: ${JSON.stringify(solicitacao)}`,
      );
      return {
        success: true,
        data: solicitacao,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Erro ao aprovar solicitação:', error.stack);
      }
      throw new InternalServerErrorException('Erro ao aprovar solicitação');
    }
  }

  @Post(':id/rejeitar')
  async rejeitarSolicitacao(@Param('id') id: string) {
    try {
      this.logger.log(`Rejeitando solicitação: ${id}`);
      const solicitacao =
        await this.solicitacaoMesaService.rejeitarSolicitacao(id);
      this.logger.log(
        `Solicitação rejeitada com sucesso: ${JSON.stringify(solicitacao)}`,
      );
      return {
        success: true,
        data: solicitacao,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Erro ao rejeitar solicitação:', error.stack);
      }
      throw new InternalServerErrorException('Erro ao rejeitar solicitação');
    }
  }
}
