import { IsEmail, IsOptional, IsBoolean, MinLength } from 'class-validator';

export class UpdateUsuarioDto {
  @IsOptional()
  nome?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @IsOptional()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  senha?: string;

  @IsOptional()
  telefone?: string;

  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;

  @IsOptional()
  @IsBoolean()
  isAtivo?: boolean;
} 