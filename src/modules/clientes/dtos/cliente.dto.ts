import { IsString, IsOptional, Length, IsNumberString } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @Length(11, 11)
  numCpf: string;

  @IsString()
  nomeCliente: string;

  @IsNumberString()
  @Length(2, 2)
  numCelPais: string;

  @IsNumberString()
  @Length(2, 2)
  numCelEstad: string;

  @IsNumberString()
  @Length(8, 8)
  numCelTelef: string;

  @IsOptional()
  @IsString()
  imgCliente?: string;
}
