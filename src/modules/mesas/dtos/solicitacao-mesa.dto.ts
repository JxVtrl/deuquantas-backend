import { IsString, IsNotEmpty, Length, IsEnum } from 'class-validator';

export class SolicitacaoMesaDto {
  @IsString()
  @IsNotEmpty()
  @Length(14, 14)
  num_cnpj: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 4)
  numMesa: string;

  @IsString()
  @IsNotEmpty()
  clienteId: string;

  @IsEnum(['pendente', 'aprovado', 'rejeitado'])
  @IsNotEmpty()
  status: 'pendente' | 'aprovado' | 'rejeitado';
}
