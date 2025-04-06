import {
  IsString,
  IsOptional,
  Length,
  IsEmail,
  IsBoolean,
} from 'class-validator';

export class CreateEstabelecimentoDto {
  @IsString()
  @Length(14, 14)
  num_cnpj: string;

  @IsEmail()
  email: string;

  @IsString()
  num_celular: string;

  @IsString()
  nome_estab: string;

  @IsString()
  razao_social: string;

  @IsString()
  endereco: string;

  @IsString()
  numero: string;

  @IsString()
  @IsOptional()
  complemento?: string;

  @IsString()
  bairro: string;

  @IsString()
  cidade: string;

  @IsString()
  @Length(2, 2)
  estado: string;

  @IsString()
  @Length(8, 8)
  cep: string;

  @IsBoolean()
  @IsOptional()
  is_ativo?: boolean;

  @IsString()
  @IsOptional()
  imgLogo?: string;

  @IsOptional()
  usuario?: any;
}
