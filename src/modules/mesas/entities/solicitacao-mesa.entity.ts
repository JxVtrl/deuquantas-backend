import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('solicitacoes_mesas')
export class SolicitacaoMesa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  num_cnpj: string;

  @Column()
  numMesa: string;

  @Column()
  clienteId: string;

  @Column({
    type: 'enum',
    enum: ['pendente', 'aprovado', 'rejeitado'],
    default: 'pendente',
  })
  status: 'pendente' | 'aprovado' | 'rejeitado';

  @CreateDateColumn()
  dataSolicitacao: Date;

  @UpdateDateColumn()
  dataAtualizacao: Date;
}
