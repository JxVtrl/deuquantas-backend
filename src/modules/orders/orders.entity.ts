import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Table } from '../tables/tables.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Table, (table) => table.orders)
  table: Table;

  @Column()
  item: string;

  @Column('decimal')
  price: number;

  @Column({ default: 'pending' }) // pending, delivered, cancelled
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
