import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../usuario.entity';

@Entity('preferencias_usuario')
export class PreferenciasUsuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  isLeftHanded: boolean;

  @Column({ default: 'pt' })
  language: string;

  @OneToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
}
