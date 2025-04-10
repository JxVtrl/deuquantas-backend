import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Comanda } from './comanda.entity';
import { Item } from '../itens/item.entity';

@Entity('comanda_itens')
export class ComandaItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  id_comanda: string;

  @Column({ type: 'uuid' })
  id_item: string;

  @Column({ type: 'int' })
  quantidade: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valor_unitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valor_total: number;

  @Column({ type: 'text', nullable: true })
  observacao: string;

  @CreateDateColumn({ type: 'timestamp' })
  data_criacao: Date;

  @ManyToOne(() => Comanda, (comanda) => comanda.itens)
  @JoinColumn({ name: 'id_comanda' })
  comanda: Comanda;

  @ManyToOne(() => Item)
  @JoinColumn({ name: 'id_item' })
  item: Item;
}
