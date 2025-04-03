import { Entity, PrimaryColumn, Column } from 'typeorm';

// Funcionario Entity
@Entity('funcionarios')
export class Funcionario {
  @PrimaryColumn({ type: 'varchar', length: 14 })
  numCnpj: string;

  @PrimaryColumn({ type: 'varchar', length: 11 })
  numCpf: string;

  @Column({ type: 'varchar', length: 30 })
  nomeFunci: string;

  @Column({ type: 'int' })
  codFuncao: number;

  @Column({ type: 'int' })
  codStatus: number;

  @Column({ type: 'timestamp' })
  datAdmiss: Date;
}
