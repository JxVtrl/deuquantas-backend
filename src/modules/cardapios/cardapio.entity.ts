import { Entity, PrimaryColumn, Column } from 'typeorm';

// Cardápio Entity
@Entity('cardapios')
export class Cardapio {
  @PrimaryColumn({ type: 'varchar', length: 14 })
  numCnpj: string;

  @PrimaryColumn({ type: 'varchar', length: 3 })
  numOrdem: string;

  @Column({ type: 'varchar', length: 15 })
  codItem: string;

  @Column({ type: 'varchar', length: 15 })
  tipItem: string;

  @Column({ type: 'int' })
  tipBarCoz: number;

  @Column({ type: 'varchar', length: 100 })
  desDetalhe: string;

  @Column({ type: 'text', nullable: true })
  imgItemEstab: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valPreco: number;
}