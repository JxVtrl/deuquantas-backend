import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Estabelecimento } from '../estabelecimentos/estabelecimento.entity';

// Itens Entity
@Entity('itens')
export class Item {
  @PrimaryColumn({ type: 'varchar', length: 15 })
  id: string;

  @Column({ type: 'varchar', length: 30 })
  nome: string;

  @Column({ type: 'varchar', length: 15 })
  tipo: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  preco: number;

  @Column({ type: 'text', nullable: true })
  img: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'boolean', default: true })
  disponivel: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data_criacao: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data_atualizacao: Date;

  @ManyToOne(
    () => Estabelecimento,
    (estabelecimento) => estabelecimento.cardapio,
    { lazy: true },
  )
  @JoinColumn({ name: 'estabelecimento_id', referencedColumnName: 'num_cnpj' })
  estabelecimento: Promise<Estabelecimento>;

  @Column({ type: 'varchar', length: 14 })
  estabelecimento_id: string;
}
