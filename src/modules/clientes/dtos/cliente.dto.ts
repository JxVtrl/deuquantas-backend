import {
  IsString,
  IsOptional,
  Length,
  IsEmail,
  IsDate,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateClienteDto {
  @IsString()
  @Length(11, 14)
  numCpf: string;

  @IsString()
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 100)
  password: string;

  @IsString()
  telefone: string;

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

  @IsBoolean()
  @IsOptional()
  isAtivo?: boolean;
}
