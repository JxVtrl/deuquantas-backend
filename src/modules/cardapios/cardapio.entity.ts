import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Estabelecimento } from '../estabelecimentos/estabelecimento.entity';
import { Item } from '../itens/item.entity';

@Entity('cardapios')
export class Cardapio {
  @PrimaryColumn({ type: 'varchar', length: 14 })
  num_cnpj: string;

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
  @ManyToOne(
    () => Estabelecimento,
    (estabelecimento) => estabelecimento.cardapios,
  )
  @JoinColumn({ name: 'num_cnpj' }) // Liga a chave estrangeira num_cnpj com Estabelecimento
  estabelecimento: Estabelecimento;
}
