import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Estabelecimento } from '../estabelecimentos/estabelecimento.entity';

// Mesa Entity
@Entity('mesas')
export class Mesa {
  @PrimaryColumn({ type: 'varchar', length: 14 })
  num_cnpj: string;

  @PrimaryColumn({ type: 'varchar', length: 4 })
  numMesa: string;

  @Column({ type: 'int' })
  numMaxPax: number;

  @Column({ type: 'boolean', default: true })
  is_ativo: boolean;

  @Column({
    type: 'enum',
    enum: ['disponivel', 'ocupada'],
    default: 'disponivel',
  })
  status: 'disponivel' | 'ocupada';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data_criacao: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data_atualizacao: Date;

  @Column({ nullable: true })
  qrCode: string;

  @ManyToOne(
    () => Estabelecimento,
    (estabelecimento) => estabelecimento.mesas,
    { lazy: true },
  )
  @JoinColumn({ name: 'num_cnpj' })
  estabelecimento: Promise<Estabelecimento>;
}
