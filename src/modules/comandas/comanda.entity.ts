import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('comandas')
export class Comanda {
  @PrimaryColumn({ type: 'varchar', length: 11 })
  numCpf: string;

  @PrimaryColumn({ type: 'varchar', length: 14 })
  numCnpj: string;

  @Column({ type: 'varchar', length: 4 })
  numMesa: string;

  @Column({ type: 'timestamp' })
  datApropriacao: Date;

  @Column({ type: 'timestamp', nullable: true })
  horPedido: Date;

  @Column({ type: 'varchar', length: 15 })
  codItem: string;

  @Column({ type: 'int' })
  numQuant: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valPreco: number;
}
