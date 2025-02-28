import { Entity, PrimaryColumn, Column } from 'typeorm';

// Itens Entity
@Entity('itens')
export class Item {
  @PrimaryColumn({ type: 'varchar', length: 15 })
  codItem: string;

  @Column({ type: 'varchar', length: 30 })
  desItem: string;

  @Column({ type: 'varchar', length: 15 })
  tipItem: string;

  @Column({ type: 'text', nullable: true })
  imgItem: string;
}