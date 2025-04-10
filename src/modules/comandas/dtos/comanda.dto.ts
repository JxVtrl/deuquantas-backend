import { IsString, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class CreateComandaDto {
  @IsString()
  num_cpf: string;

  @IsString()
  num_cnpj: string;

  @IsString()
  numMesa: string;

  @IsDateString()
  datApropriacao: string;

  @IsDateString()
  horPedido: string;

  @IsString()
  @IsOptional()
  codItem?: string;

  @IsNumber()
  @IsOptional()
  numQuant?: number;

  @IsNumber()
  @IsOptional()
  valPreco?: number;

  @IsNumber()
  @IsOptional()
  valConta?: number;

  @IsDateString()
  @IsOptional()
  datConta?: string;
}
