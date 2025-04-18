import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Cliente } from '../clientes/cliente.entity';
import { Estabelecimento } from '../estabelecimentos/estabelecimento.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ select: false })
  password: string;

  @Column({ default: false })
  is_admin: boolean;

  @Column({ default: true })
  is_ativo: boolean;

  @CreateDateColumn()
  data_criacao: Date;

  @UpdateDateColumn()
  data_atualizacao: Date;

  @OneToOne(() => Cliente, (cliente) => cliente.usuario, { nullable: true })
  cliente: Cliente;

  @OneToOne(
    () => Estabelecimento,
    (estabelecimento) => estabelecimento.usuario,
    { nullable: true },
  )
  estabelecimento: Estabelecimento;
}
