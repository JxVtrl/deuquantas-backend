import { Entity, PrimaryColumn, Column } from 'typeorm';

// Mesa Entity
@Entity('mesas')
export class Mesa {
  @PrimaryColumn({ type: 'varchar', length: 14 })
  num_cnpj: string;

  @PrimaryColumn({ type: 'varchar', length: 4 })
  numMesa: string;

  @Column({ type: 'int' })
  numMaxPax: number;
}
