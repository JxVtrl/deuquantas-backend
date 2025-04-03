import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario } from '../usuario.entity';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async create(
    createUsuarioDto: CreateUsuarioDto,
  ): Promise<Omit<Usuario, 'password'>> {

    console.log('Dados recebidos para criação:', createUsuarioDto);

    const { email, password } = createUsuarioDto;

    // Verificar se o usuário já existe
    const usuarioExistente = await this.usuarioRepository.findOne({
      where: { email },
    });

    if (usuarioExistente) {
      throw new ConflictException('Email já cadastrado');
    }

    // Criptografar a senha
    const salt = await bcrypt.genSalt();
    const senhaHash = await bcrypt.hash(password, salt);

    // Criar o usuário
    const usuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      password: senhaHash,
    });

    await this.usuarioRepository.save(usuario);

    // Remover a senha do objeto retornado
    const { password: _, ...result } = usuario;
    return result;
  }

  async findByEmail(email: string, incluirSenha = false): Promise<Usuario> {
    const queryBuilder = this.usuarioRepository.createQueryBuilder('usuario');

    if (incluirSenha) {
      queryBuilder.addSelect('usuario.password');
    }

    const usuario = await queryBuilder
      .where('usuario.email = :email', { email })
      .getOne();

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return usuario;
  }

  async findById(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return usuario;
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const usuario = await this.findById(id);

    // Se estiver atualizando o email, verificar se já existe
    if (updateUsuarioDto.email && updateUsuarioDto.email !== usuario.email) {
      const emailExistente = await this.usuarioRepository.findOne({
        where: { email: updateUsuarioDto.email },
      });

      if (emailExistente) {
        throw new ConflictException('Email já cadastrado');
      }
    }

    // Se estiver atualizando a senha, criptografar
    if (updateUsuarioDto.password) {
      const salt = await bcrypt.genSalt();
      updateUsuarioDto.password = await bcrypt.hash(
        updateUsuarioDto.password,
        salt,
      );
    }

    // Atualizar o usuário
    Object.assign(usuario, updateUsuarioDto);
    await this.usuarioRepository.save(usuario);

    // Remover a senha do objeto retornado
    const { password: _, ...result } = usuario;
    return result as Usuario;
  }
}
