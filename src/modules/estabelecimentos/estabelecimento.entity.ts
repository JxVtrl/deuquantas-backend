import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Cardapio } from '../cardapios/cardapio.entity';
import { Usuario } from '../usuarios/usuario.entity';

// Estabelecimento Entity
@Entity('estabelecimentos')
export class Estabelecimento {
  @PrimaryColumn({ type: 'varchar', length: 14 })
  numCnpj: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  numCelular: string;

  @Column({ type: 'varchar', length: 100 })
  nomeEstab: string;

  @Column({ type: 'varchar', length: 100 })
  razaoSocial: string;

  @Column({ type: 'varchar', length: 100 })
  endereco: string;

  @Column({ type: 'varchar', length: 10 })
  numero: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  complemento: string;

  @Column({ type: 'varchar', length: 100 })
  bairro: string;

  @Column({ type: 'varchar', length: 100 })
  cidade: string;

  @Column({ type: 'varchar', length: 2 })
  estado: string;

  @Column({ type: 'varchar', length: 8 })
  cep: string;

  @Column({ type: 'boolean', default: true })
  isAtivo: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataCriacao: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataAtualizacao: Date;

  @Column({ type: 'text', nullable: true })
  imgLogo: string;

  @OneToMany(() => Cardapio, (cardapio) => cardapio.estabelecimento)
  cardapios: Cardapio[];

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  longitude: number;

  @Column({ type: 'enum', enum: ['ativo', 'em_breve'], default: 'em_breve' })
  status: 'ativo' | 'em_breve';

  @OneToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
}
