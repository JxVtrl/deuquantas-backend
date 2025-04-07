import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  Put,
  Logger,
} from '@nestjs/common';
import { UsuarioService } from '../services/usuario.service';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { Usuario } from '../usuario.entity';
import { AuthGuard } from '../../../auth/auth.guard';

@Controller('usuarios')
export class UsuarioController {
  private readonly logger = new Logger(UsuarioController.name);

  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async create(
    @Body() createUsuarioDto: CreateUsuarioDto,
  ): Promise<Omit<Usuario, 'password'>> {
    this.logger.log(`Criando novo usuário com email: ${createUsuarioDto.email}`);
    const usuario = await this.usuarioService.create(createUsuarioDto);
    this.logger.log(`Usuário criado com sucesso. ID: ${usuario.id}`);
    return usuario;
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(): Promise<Usuario[]> {
    this.logger.log('Buscando todos os usuários');
    const usuarios = await this.usuarioService.findAll();
    this.logger.log(`Encontrados ${usuarios.length} usuários`);
    return usuarios;
  }

  @Get('check-email/:email')
  async checkEmail(
    @Param('email') email: string,
  ): Promise<{ exists: boolean }> {
    this.logger.log(`Verificando existência do email: ${email}`);
    try {
      await this.usuarioService.findByEmail(email);
      this.logger.log(`Email ${email} encontrado`);
      return { exists: true };
    } catch (error) {
      this.logger.error(`Erro ao verificar email ${email}:`, error);
      return { exists: false };
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string): Promise<Usuario> {
    this.logger.log(`Buscando usuário com ID: ${id}`);
    const usuario = await this.usuarioService.findById(id);
    this.logger.log(`Usuário ${usuario ? 'encontrado' : 'não encontrado'} com ID: ${id}`);
    return usuario;
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    this.logger.log(`Atualizando usuário com ID: ${id}`);
    const usuario = await this.usuarioService.update(id, updateUsuarioDto);
    this.logger.log(`Usuário atualizado com sucesso. ID: ${id}`);
    return usuario;
  }
}
