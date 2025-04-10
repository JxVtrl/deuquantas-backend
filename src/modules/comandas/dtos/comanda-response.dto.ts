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
  conta: ContaResponseDto;
  itens: ComandaItemResponseDto[];

  constructor(data: ComandaData) {
    this.id = data.id;
    this.num_cpf = data.num_cpf;
    this.num_cnpj = data.num_cnpj;
    this.numMesa = data.numMesa;
    this.status = data.status;
    this.data_criacao = data.data_criacao.toISOString();
    
    // Criar uma conta com valores zerados se não existir
    this.conta = data.conta ? new ContaResponseDto(data.conta) : new ContaResponseDto({
      id: '',
      id_comanda: data.id,
      valTotal: 0,
      valDesconto: 0,
      valServico: 0,
      codFormaPg: null,
      codErro: null,
      data_criacao: new Date(),
    });
    
    this.itens = data.itens
      ? data.itens.map((item) => new ComandaItemResponseDto(item))
      : [];
  }
}
