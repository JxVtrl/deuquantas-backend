import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from '../orders/orders.entity';

@Entity('tables')
export class Table {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: number;

  @Column({ default: false })
  isOccupied: boolean;

  @OneToMany(() => Order, (order) => order.table)
  orders: Order[];
}
