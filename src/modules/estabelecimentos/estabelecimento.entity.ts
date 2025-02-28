import { Entity, PrimaryColumn, Column } from 'typeorm';

// Estabelecimento Entity
@Entity('estabelecimentos')
export class Estabelecimento {
  @PrimaryColumn({ type: 'varchar', length: 14 })
  numCnpj: string;

  @Column({ type: 'varchar', length: 30 })
  nomeEstab: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  nomeContato: string;

  @Column({ type: 'varchar', length: 12, nullable: true })
  numCelular: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  datInicio: Date;

  @Column({ type: 'int', default: 1 })
  codStatus: number;

  @Column({ type: 'text', nullable: true })
  imgLogo: string;
}