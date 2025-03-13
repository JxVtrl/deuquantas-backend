import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Cardapio } from '../cardapios/cardapio.entity';

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

  @OneToMany(() => Cardapio, (cardapio) => cardapio.estabelecimento)
  cardapios: Cardapio[];

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  longitude: number;

  @Column({ type: 'enum', enum: ['ativo', 'em_breve'], default: 'em_breve' })
  status: 'ativo' | 'em_breve';
}
