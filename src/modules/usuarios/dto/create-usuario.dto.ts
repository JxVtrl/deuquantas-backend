import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  MinLength,
  IsString,
  IsDate,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;
}

export class CreateUsuarioClienteDto extends CreateUsuarioDto {
  @IsString()
  @Length(11, 14)
  numCpf: string;

  @IsString()
  numCelular: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  dataNascimento: Date;

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
}

export class CreateUsuarioEstabelecimentoDto extends CreateUsuarioDto {
  @IsString()
  @Length(14, 14)
  numCnpj: string;

  @IsString()
  numCelular: string;

  @IsString()
  nomeEstab: string;

  @IsString()
  razaoSocial: string;

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

  @IsString()
  @IsOptional()
  imgLogo?: string;
}
