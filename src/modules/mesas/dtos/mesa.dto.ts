import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Length,
} from 'class-validator';

export class CreateMesaDto {
  @IsString()
  @Length(14, 14)
  num_cnpj: string;

  @IsString()
  @Length(1, 4)
  numMesa: string;

  @IsNumber()
  numMaxPax: number;

  @IsBoolean()
  @IsOptional()
  is_ativo?: boolean;
}

export class UpdateMesaDto {
  @IsString()
  @Length(14, 14)
  num_cnpj: string;

  @IsString()
  @IsOptional()
  numMesa?: string;

  @IsNumber()
  @IsOptional()
  numMaxPax?: number;

  @IsBoolean()
  @IsOptional()
  is_ativo?: boolean;
}
