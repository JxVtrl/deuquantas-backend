import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Table } from '../tables/tables.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Table)
  table: Table;

  @Column('decimal')
  amount: number;

  @Column()
  method: string; // credit_card, pix, cash

  @CreateDateColumn()
  createdAt: Date;
}
