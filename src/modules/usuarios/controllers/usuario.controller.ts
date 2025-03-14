import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  Put,
} from '@nestjs/common';
import { UsuarioService } from '../services/usuario.service';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { Usuario } from '../usuario.entity';
import { AuthGuard } from '../../../auth/auth.guard';
import { Roles } from '../../../auth/roles.decorator';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async create(
    @Body() createUsuarioDto: CreateUsuarioDto,
  ): Promise<Omit<Usuario, 'password'>> {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @Roles('admin')
  async findAll(): Promise<Usuario[]> {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string): Promise<Usuario> {
    return this.usuarioService.findById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    return this.usuarioService.update(id, updateUsuarioDto);
  }
}
