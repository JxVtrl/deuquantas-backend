import { IsString, IsNumber, Length } from 'class-validator';

export class CreateMesaDto {
  @IsString()
  @Length(14, 14)
  num_cnpj: string;

  @IsString()
  @Length(4, 4)
  numMesa: string;

  @IsNumber()
  numMaxPax: number;
}
