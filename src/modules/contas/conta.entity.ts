import { Entity, PrimaryGeneratedColumn, Column, OneToOne, CreateDateColumn } from 'typeorm';
import { Comanda } from '../comandas/comanda.entity';

// Conta Entity
@Entity('contas')
export class Conta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  id_comanda: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  valTotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  valDesconto: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  valServico: number;

  @Column({ type: 'int', nullable: true })
  codFormaPg: number;

  @Column({ type: 'timestamp', nullable: true })
  horPagto: Date;

  @Column({ type: 'int', nullable: true })
  codErro: number;

  @CreateDateColumn({ type: 'timestamp' })
  data_criacao: Date;

  @Column({ type: 'timestamp', nullable: true })
  data_fechamento: Date;

  @OneToOne(() => Comanda, (comanda) => comanda.conta)
  comanda: Comanda;
}
