import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Conta } from '../contas/conta.entity';
@Entity('comandas')
export class Comanda {
  @PrimaryColumn({ type: 'varchar', length: 11 })
  num_cpf: string;

  @PrimaryColumn({ type: 'varchar', length: 14 })
  num_cnpj: string;

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

  @Column({ type: 'boolean', default: true })
  is_ativo: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  data_criacao: Date;

  @OneToOne(() => Conta)
  @JoinColumn([
    { name: 'num_cnpj', referencedColumnName: 'num_cnpj' },
    { name: 'numMesa', referencedColumnName: 'numMesa' },
    { name: 'num_cpf', referencedColumnName: 'num_cpf' },
  ])
  conta: Conta;
}
