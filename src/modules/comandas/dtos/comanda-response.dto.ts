import { Conta } from '../../contas/conta.entity';

interface ComandaData {
  id: string;
  num_cnpj: string;
  numMesa: string;
  num_cpf: string;
  datApropriacao: Date;
  horPedido: Date;
  codItem: string;
  numQuant: number;
  valPreco: number;
  valTotal: number;
  status: 'ativo' | 'finalizado';
  codFormaPg: number;
  horPagto?: Date;
  codErro?: number;
  data_criacao: Date;
  valConta: number;
  datConta: Date;
}

export class ComandaResponseDto {
  id: string;
  num_cnpj: string;
  numMesa: string;
  num_cpf: string;
  datApropriacao: string;
  horPedido: string;
  codItem: string;
  numQuant: number;
  valPreco: number;
  valTotal: number;
  status: 'ativo' | 'finalizado';
  codFormaPg: number;
  horPagto?: string;
  codErro?: number;
  data_criacao: string;
  valConta: number;
  datConta: string;

  constructor(data: ComandaData) {
    this.id = data.id;
    this.num_cnpj = data.num_cnpj;
    this.numMesa = data.numMesa;
    this.num_cpf = data.num_cpf;
    this.datApropriacao = data.datApropriacao.toISOString();
    this.horPedido = data.horPedido.toISOString();
    this.codItem = data.codItem;
    this.numQuant = data.numQuant;
    this.valPreco = data.valPreco;
    this.valTotal = data.valTotal;
    this.status = data.status;
    this.codFormaPg = data.codFormaPg;
    this.horPagto = data.horPagto?.toISOString();
    this.codErro = data.codErro;
    this.data_criacao = data.data_criacao.toISOString();
    this.valConta = data.valConta;
    this.datConta = data.datConta.toISOString();
  }
}
