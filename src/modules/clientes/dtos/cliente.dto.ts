import {
  IsString,
  IsOptional,
  Length,
  IsEmail,
  IsDate,
  IsBoolean,
  IsObject,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Usuario } from '../../usuarios/usuario.entity';

export class CreateClienteDto {
  @IsString()
  @Length(11, 14)
  num_cpf: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  num_celular: string;

  @Transform(({ value }) => {
    if (!value) return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  })
  @IsDate()
  data_nascimento: Date;

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

  @IsObject()
  @IsOptional()
  usuario?: Omit<Usuario, 'password'>;
}
