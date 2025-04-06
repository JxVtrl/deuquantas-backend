import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';

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
}
