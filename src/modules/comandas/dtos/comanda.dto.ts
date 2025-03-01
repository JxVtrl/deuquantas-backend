import { IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateComandaDto {
  @IsString()
  numCpf: string;

  @IsString()
  numCnpj: string;

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
