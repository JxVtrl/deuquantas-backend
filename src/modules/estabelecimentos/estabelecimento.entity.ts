import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import { Mesa } from '../mesas/mesa.entity';
import { Item } from '../itens/item.entity';

// Estabelecimento Entity
@Entity('estabelecimentos')
export class Estabelecimento {
  @PrimaryColumn({ type: 'varchar', length: 14 })
  num_cnpj: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  num_celular: string;

  @Column({ type: 'varchar', length: 100 })
  nome_estab: string;

  @Column({ type: 'varchar', length: 100 })
  razao_social: string;

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
  is_ativo: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data_criacao: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data_atualizacao: Date;

  @Column({ type: 'text', nullable: true })
  imgLogo: string;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  longitude: number;

  @Column({ type: 'enum', enum: ['ativo', 'em_breve'], default: 'em_breve' })
  status: 'ativo' | 'em_breve';

  @OneToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @OneToMany(() => Mesa, (mesa) => mesa.estabelecimento, { lazy: true })
  mesas: Promise<Mesa[]>;

  @OneToMany(() => Item, (item) => item.estabelecimento, { lazy: true })
  cardapio: Promise<Item[]>;
}
