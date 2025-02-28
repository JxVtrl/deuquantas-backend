import { Entity, PrimaryColumn, Column } from 'typeorm';

// Mesa Entity
@Entity('mesas')
export class Mesa {
  @PrimaryColumn({ type: 'varchar', length: 14 })
  numCnpj: string;

  @PrimaryColumn({ type: 'varchar', length: 4 })
  numMesa: string;

  @Column({ type: 'int' })
  numMaxPax: number;
}