import { Entity, PrimaryColumn, Column } from 'typeorm';

// Conta Entity
@Entity('contas')
export class Conta {
  @PrimaryColumn({ type: 'varchar', length: 14 })
  numCnpj: string;

  @PrimaryColumn({ type: 'varchar', length: 4 })
  numMesa: string;

  @Column({ type: 'varchar', length: 11 })
  numCpf: string;

  @Column({ type: 'timestamp' })
  datConta: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valConta: number;

  @Column({ type: 'int' })
  codFormaPg: number;

  @Column({ type: 'timestamp', nullable: true })
  horPagto: Date;

  @Column({ type: 'int', nullable: true })
  codErro: number;
}
