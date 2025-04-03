import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  MinLength,
  IsString,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUsuarioDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  numCpf: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  dataNascimento: Date;

  @IsString()
  @IsNotEmpty()
  endereco: string;

  @IsString()
  @IsNotEmpty()
  numero: string;

  @IsString()
  @IsNotEmpty()
  bairro: string;

  @IsString()
  @IsNotEmpty()
  cidade: string;

  @IsString()
  @IsNotEmpty()
  estado: string;

  @IsString()
  @IsNotEmpty()
  cep: string;

  @IsString()
  @IsNotEmpty()
  telefone: string;

  @IsString()
  @IsNotEmpty()
  celular: string;

  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;
}
