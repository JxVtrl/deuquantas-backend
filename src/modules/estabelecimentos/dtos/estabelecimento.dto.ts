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
  numCnpj: string;

  @IsString()
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 100)
  password: string;

  @IsString()
  telefone: string;

  @IsString()
  nomeEstab: string;

  @IsString()
  razaoSocial: string;

  @IsString()
  numCelular: string;

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
  isAtivo?: boolean;

  @IsString()
  @IsOptional()
  imgLogo?: string;
}
