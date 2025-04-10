import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateComandaItemDto {
  @IsString()
  id_item: string;

  @IsNumber()
  quantidade: number;

  @IsOptional()
  @IsString()
  observacao?: string;
}

interface ComandaItemData {
  id: string;
  id_comanda: string;
  id_item: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  observacao?: string;
  data_criacao: Date;
  item: {
    id: string;
    nome: string;
    descricao: string;
    preco: number;
    categoria: string;
  };
}

export class ComandaItemResponseDto {
  id: string;
  id_comanda: string;
  id_item: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  observacao: string | null;
  data_criacao: string;
  item: {
    id: string;
    nome: string;
    descricao: string;
    preco: number;
    categoria: string;
  };

  constructor(data: ComandaItemData) {
    this.id = data.id;
    this.id_comanda = data.id_comanda;
    this.id_item = data.id_item;
    this.quantidade = data.quantidade;
    this.valor_unitario = data.valor_unitario;
    this.valor_total = data.valor_total;
    this.observacao = data.observacao || null;
    this.data_criacao = data.data_criacao.toISOString();
    this.item = data.item;
  }
}
