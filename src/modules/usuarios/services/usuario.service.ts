import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario } from '../usuario.entity';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
  private readonly logger = new Logger(UsuarioService.name);

  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async create(
    createUsuarioDto: CreateUsuarioDto,
  ): Promise<Omit<Usuario, 'password'>> {
    this.logger.log(`Criando novo usuário com email: ${createUsuarioDto.email}`);

    const { email, password } = createUsuarioDto;

    // Verificar se o usuário já existe
    this.logger.log(`Verificando se o email ${email} já está cadastrado`);
    const usuarioExistente = await this.usuarioRepository.findOne({
      where: { email },
    });

    if (usuarioExistente) {
      this.logger.error(`Email ${email} já está cadastrado`);
      throw new ConflictException('Email já cadastrado');
    }

    // Criptografar a senha
    this.logger.log('Criptografando senha do usuário');
    const salt = await bcrypt.genSalt();
    const senhaHash = await bcrypt.hash(password, salt);

    // Criar o usuário
    this.logger.log('Criando usuário no banco de dados');
    const usuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      password: senhaHash,
    });

    await this.usuarioRepository.save(usuario);

    // Remover a senha do objeto retornado
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = usuario;
    this.logger.log(`Usuário criado com sucesso. ID: ${result.id}`);
    return result;
  }

  async findByEmail(email: string, includePassword = false): Promise<Usuario> {
    this.logger.log(`Buscando usuário com email: ${email} no banco de dados`);
    const queryBuilder = this.usuarioRepository
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.cliente', 'cliente')
      .leftJoinAndSelect('usuario.estabelecimento', 'estabelecimento')
      .where('usuario.email = :email', { email });

    if (includePassword) {
      queryBuilder.addSelect('usuario.password');
    }

    const usuario = await queryBuilder.getOne();

    if (!usuario) {
      this.logger.error(`Usuário não encontrado para o email: ${email}`);
      throw new NotFoundException('Usuário não encontrado');
    }

    this.logger.log(`Usuário encontrado para o email: ${email}`);
    return usuario;
  }

  async findById(id: string): Promise<Usuario> {
    this.logger.log(`Buscando usuário com ID: ${id} no banco de dados`);
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['cliente', 'estabelecimento'],
    });

    if (!usuario) {
      this.logger.error(`Usuário não encontrado com ID: ${id}`);
      throw new NotFoundException('Usuário não encontrado');
    }

    this.logger.log(`Usuário encontrado com ID: ${id}`);
    return usuario;
  }

  async findAll(): Promise<Usuario[]> {
    this.logger.log('Buscando todos os usuários no banco de dados');
    const usuarios = await this.usuarioRepository.find();
    this.logger.log(`Retornando ${usuarios.length} usuários do banco de dados`);
    return usuarios;
  }

  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    this.logger.log(`Atualizando usuário com ID: ${id}`);
    const usuario = await this.findById(id);

    // Se estiver atualizando o email, verificar se já existe
    if (updateUsuarioDto.email && updateUsuarioDto.email !== usuario.email) {
      this.logger.log(`Verificando se o novo email ${updateUsuarioDto.email} já está cadastrado`);
      const usuarioExistente = await this.usuarioRepository.findOne({
        where: { email: updateUsuarioDto.email },
      });

      if (usuarioExistente) {
        this.logger.error(`Email ${updateUsuarioDto.email} já está cadastrado`);
        throw new ConflictException('Email já cadastrado');
      }
    }

    // Se estiver atualizando a senha, criptografar
    if (updateUsuarioDto.password) {
      this.logger.log('Criptografando nova senha do usuário');
      const salt = await bcrypt.genSalt();
      updateUsuarioDto.password = await bcrypt.hash(
        updateUsuarioDto.password,
        salt,
      );
    }

    // Atualizar o usuário
    this.logger.log('Atualizando usuário no banco de dados');
    Object.assign(usuario, updateUsuarioDto);
    await this.usuarioRepository.save(usuario);

    // Remover a senha do objeto retornado
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = usuario;
    this.logger.log(`Usuário atualizado com sucesso. ID: ${id}`);
    return result as Usuario;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removendo usuário com ID: ${id}`);
    const usuario = await this.findById(id);
    await this.usuarioRepository.remove(usuario);
    this.logger.log(`Usuário removido com sucesso. ID: ${id}`);
  }
}
