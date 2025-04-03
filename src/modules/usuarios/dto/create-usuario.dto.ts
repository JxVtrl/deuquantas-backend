import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  MinLength,
} from 'class-validator';

export class CreateUsuarioDto {
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password: string;

  @IsOptional()
  telefone?: string;

  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;
}
