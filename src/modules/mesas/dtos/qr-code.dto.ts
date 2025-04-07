import { IsString, IsNotEmpty, Length } from 'class-validator';

export class QrCodeDto {
  @IsString()
  @IsNotEmpty()
  @Length(14, 14)
  num_cnpj: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 4)
  numMesa: string;
}
