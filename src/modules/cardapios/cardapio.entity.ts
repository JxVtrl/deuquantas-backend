import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Estabelecimento } from '../estabelecimentos/estabelecimento.entity';
import { Item } from '../itens/item.entity';

@Entity('cardapios')
export class Cardapio {
  @PrimaryColumn({ type: 'varchar', length: 14 })
  numCnpj: string;

  @PrimaryColumn({ type: 'varchar', length: 3 })
  numOrdem: string;

  @ManyToOne(() => Item, (item) => item.codItem) // Relacionamento com Item
  @JoinColumn({ name: 'codItem' }) // Chave estrangeira para Item
  item: Item;

  @Column({ type: 'int' })
  tipBarCoz: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valPreco: number;

  // Relacionamento com Estabelecimento para obter o nome do restaurante
  @ManyToOne(() => Estabelecimento, (estabelecimento) => estabelecimento.cardapios)
  @JoinColumn({ name: 'numCnpj' }) // Liga a chave estrangeira numCnpj com Estabelecimento
  estabelecimento: Estabelecimento;
}
