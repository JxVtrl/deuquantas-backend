import { Entity, PrimaryColumn, Column } from 'typeorm';

// Funcionario Entity
@Entity('funcionarios')
export class Funcionario {
  @PrimaryColumn({ type: 'varchar', length: 14 })
  num_cnpj: string;

  @PrimaryColumn({ type: 'varchar', length: 11 })
  num_cpf: string;

  @Column({ type: 'varchar', length: 30 })
  nomeFunci: string;

  @Column({ type: 'int' })
  codFuncao: number;

  @Column({ type: 'int' })
  codStatus: number;

  @Column({ type: 'timestamp' })
  datAdmiss: Date;
}
