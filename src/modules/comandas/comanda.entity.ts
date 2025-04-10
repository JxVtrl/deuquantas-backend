import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('comandas')
export class Comanda {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 11 })
  num_cpf: string;

  @Column({ length: 14 })
  num_cnpj: string;

  @Column({ length: 4 })
  numMesa: string;

  @Column({ type: 'timestamp' })
  datApropriacao: Date;

  @Column({ type: 'timestamp', nullable: true })
  horPedido: Date;

  @Column({ length: 15 })
  codItem: string;

  @Column({ type: 'int' })
  numQuant: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valPreco: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  valTotal: number;

  @Column({
    type: 'enum',
    enum: ['ativo', 'finalizado'],
    default: 'ativo',
  })
  status: 'ativo' | 'finalizado';

  @Column({ type: 'int', default: 0 })
  codFormaPg: number;

  @Column({ type: 'timestamp', nullable: true })
  horPagto: Date;

  @Column({ type: 'int', nullable: true })
  codErro: number;

  @CreateDateColumn({ type: 'timestamp' })
  data_criacao: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  valConta: number;

  @Column({ type: 'timestamp' })
  datConta: Date;
}
