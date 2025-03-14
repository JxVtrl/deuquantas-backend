import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  nome: string;

  @Column({ select: false })
  senha: string;

  @Column({ nullable: true })
  telefone: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: true })
  isAtivo: boolean;

  @CreateDateColumn()
  dataCriacao: Date;

  @UpdateDateColumn()
  dataAtualizacao: Date;
} 