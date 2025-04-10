import { ContaResponseDto } from '../../contas/dtos/conta.dto';
import { ComandaItemResponseDto } from './comanda-item.dto';

interface ComandaData {
  id: string;
  num_cpf: string;
  num_cnpj: string;
  numMesa: string;
  status: 'ativo' | 'finalizado';
  data_criacao: Date;
  conta?: any;
  itens?: any[];
}

export class ComandaResponseDto {
  id: string;
  num_cpf: string;
  num_cnpj: string;
  numMesa: string;
  status: 'ativo' | 'finalizado';
  data_criacao: string;
  conta?: ContaResponseDto;
  itens: ComandaItemResponseDto[];

  constructor(data: ComandaData) {
    this.id = data.id;
    this.num_cpf = data.num_cpf;
    this.num_cnpj = data.num_cnpj;
    this.numMesa = data.numMesa;
    this.status = data.status;
    this.data_criacao = data.data_criacao.toISOString();
    this.conta = data.conta ? new ContaResponseDto(data.conta) : undefined;
    this.itens = data.itens ? data.itens.map(item => new ComandaItemResponseDto(item)) : [];
  }
}
