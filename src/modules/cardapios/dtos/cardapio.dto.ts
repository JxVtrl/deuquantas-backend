import { IsString, IsNumber, IsOptional, IsDecimal } from 'class-validator';

export class CreateCardapioDto {
  @IsString()
  numCnpj: string;

  @IsString()
  numOrdem: string;

  @IsString()
  codItem: string;

  @IsString()
  tipItem: string;

  @IsNumber()
  tipBarCoz: number;

  @IsString()
  desDetalhe: string;

  @IsOptional()
  @IsString()
  imgItemEstab?: string;

  @IsDecimal()
  valPreco: number;
}
