import { IsString, IsOptional, Length, IsNumberString } from 'class-validator';

export class CreateEstabelecimentoDto {
  @IsString()
  @Length(14, 14)
  numCnpj: string;

  @IsString()
  nomeEstab: string;

  @IsOptional()
  @IsString()
  nomeContato?: string;

  @IsOptional()
  @IsNumberString()
  @Length(12, 12)
  numCelular?: string;

  @IsOptional()
  @IsString()
  imgLogo?: string;
}
