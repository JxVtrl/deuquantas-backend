import { IsString, IsDateString, IsNumber } from 'class-validator';

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
  codItem: string;

  @IsNumber()
  numQuant: number;

  @IsNumber()
  valPreco: number;
}
