import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateItemDto {
  @IsString()
  id: string;

  @IsString()
  nome: string;

  @IsString()
  tipo: string;

  @IsNumber()
  preco: number;

  @IsOptional()
  @IsString()
  img?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsBoolean()
  disponivel?: boolean;

  @IsOptional()
  @IsString()
  estabelecimento_id?: string;
}
