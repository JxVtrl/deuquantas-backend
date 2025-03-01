import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateContaDto {
  @IsString()
  numCnpj: string;

  @IsString()
  numMesa: string;

  @IsString()
  numCpf: string;

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
