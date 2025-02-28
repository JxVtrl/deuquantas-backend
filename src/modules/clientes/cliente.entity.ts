import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('clientes')
export class Cliente {
  @PrimaryColumn({ type: 'varchar', length: 11 })
  numCpf: string;

  @Column({ type: 'varchar', length: 30 })
  nomeCliente: string;

  @Column({ type: 'varchar', length: 2 })
  numCelPais: string;

  @Column({ type: 'varchar', length: 2 })
  numCelEstad: string;

  @Column({ type: 'varchar', length: 8 })
  numCelTelef: string;

  @Column({ type: 'varchar', length: 16, nullable: true })
  numCartao: string;

  @Column({ type: 'varchar', length: 2, nullable: true })
  datValidMm: string;

  @Column({ type: 'varchar', length: 2, nullable: true })
  datValidAa: string;

  @Column({ type: 'varchar', length: 3, nullable: true })
  codCartao: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  datRegistro: Date;

  @Column({ type: 'text', nullable: true })
  imgCliente: string;
}