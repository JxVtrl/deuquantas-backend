import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ComandaService } from '../services/comanda.service';
import { TestComandaService } from '../services/test-comanda.service';
import { CreateComandaDto } from '../dtos/comanda.dto';
import { JwtAuthGuard } from '../../../auth/auth.guard';

@Controller('comandas')
export class ComandaController {
  constructor(
    private readonly comandaService: ComandaService,
    private readonly testComandaService: TestComandaService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllComandas() {
    return this.comandaService.getAllComandas();
  }

  @Get('test')
  async getAllTestComandas() {
    return this.testComandaService.getAllTestComandas();
  }

  @Get(':numCpf')
  @UseGuards(JwtAuthGuard)
  async getComandaByCpf(@Param('numCpf') numCpf: string) {
    return this.comandaService.getComandaByCpf(numCpf);
  }

  @Get('test/:numCpf')
  async getTestComandaByCpf(@Param('numCpf') numCpf: string) {
    return this.testComandaService.getTestComandaByCpf(numCpf);
  }

  @Post()
  async createComanda(
    @Body() createComandaDto: CreateComandaDto,
    @Query('isTest') isTest: string
  ) {
    // Se isTest=true ou estamos em ambiente de desenvolvimento, criar na tabela de teste
    if (isTest === 'true' || process.env.NODE_ENV === 'development') {
      try {
        // Tenta criar na tabela de teste
        const testComanda = await this.testComandaService.createTestComanda(createComandaDto);
        
        // Se não estamos em modo de teste explícito e o ambiente não é de desenvolvimento,
        // também tenta criar na tabela real (com autenticação)
        if (isTest !== 'true' && process.env.NODE_ENV !== 'development') {
          try {
            await this.comandaService.createComanda(createComandaDto);
          } catch (error) {
            console.error('Erro ao criar comanda real:', error);
            // Continua mesmo com erro na tabela real
          }
        }
        
        return testComanda;
      } catch (error) {
        console.error('Erro ao criar comanda de teste:', error);
        throw error;
      }
    } else {
      // Se não é teste, usa o serviço normal com autenticação
      return this.comandaService.createComanda(createComandaDto);
    }
  }
}
