import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';

interface ContaData {
  id: string;
  id_comanda: string;
  valTotal: number;
  valDesconto: number;
  valServico: number;
  codFormaPg: number | null;
  horPagto?: Date;
  codErro: number | null;
  data_criacao: Date;
  data_fechamento?: Date;
}

export class CreateContaDto {
  @IsString()
  num_cnpj: string;

  @IsString()
  numMesa: string;

  @IsString()
  num_cpf: string;

  @IsDateString()
  datConta: string;

  @IsNumber()
  valConta: number;

  @IsNumber()
  codFormaPg: number;

  @IsOptional()
  @IsDateString()
  horPagto?: string;

  @IsOptional()
  @IsNumber()
  codErro?: number;

  id_comanda: string;
  valTotal?: number;
  valDesconto?: number;
  valServico?: number;
}

export class ContaResponseDto {
  id: string;
  id_comanda: string;
  valTotal: number;
  valDesconto: number;
  valServico: number;
  codFormaPg: number | null;
  horPagto: string | null;
  codErro: number | null;
  data_criacao: string;
  data_fechamento: string | null;

  constructor(data: ContaData) {
    this.id = data.id;
    this.id_comanda = data.id_comanda;
    this.valTotal = data.valTotal || 0;
    this.valDesconto = data.valDesconto || 0;
    this.valServico = data.valServico || 0;
    this.codFormaPg = data.codFormaPg;
    this.horPagto = data.horPagto?.toISOString() || null;
    this.codErro = data.codErro;
    this.data_criacao = data.data_criacao.toISOString();
    this.data_fechamento = data.data_fechamento?.toISOString() || null;
  }
}
