import {
  IsOptional,
  IsString,
  IsEmail,
  MinLength,
  IsBoolean,
} from 'class-validator';
import { Cliente } from '../../clientes/cliente.entity';
import { Estabelecimento } from '../../estabelecimentos/estabelecimento.entity';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsBoolean()
  is_admin?: boolean;

  @IsOptional()
  @IsBoolean()
  is_ativo?: boolean;

  @IsOptional()
  cliente?: Cliente;

  @IsOptional()
  estabelecimento?: Estabelecimento;
}
