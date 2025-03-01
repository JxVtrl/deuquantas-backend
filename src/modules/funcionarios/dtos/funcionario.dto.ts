import { IsString, IsNumber, Length, IsDateString } from 'class-validator';

export class CreateFuncionarioDto {
  @IsString()
  @Length(14, 14)
  numCnpj: string;

  @IsString()
  @Length(11, 11)
  numCpf: string;

  @IsString()
  nomeFunci: string;

  @IsNumber()
  codFuncao: number;

  @IsNumber()
  codStatus: number;

  @IsDateString()
  datAdmiss: string;
}
