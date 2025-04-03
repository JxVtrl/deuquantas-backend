import { Entity, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('clientes')
export class Cliente {
  @PrimaryColumn({ type: 'varchar', length: 14 })
  numCpf: string;

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  @Exclude()
  senha: string;

  @Column({ type: 'varchar', length: 20 })
  telefone: string;

  @Column({ type: 'date' })
  dataNascimento: Date;

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
}
