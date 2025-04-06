import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { PreferenciasUsuarioService } from '../services/preferencias-usuario.service';
import { UpdatePreferenciasUsuarioDto } from '../dto/update-preferencias-usuario.dto';
import { CurrentUser } from '../../../auth/decorators/current-user.decorator';
import { Usuario } from '../usuario.entity';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@Controller('preferencias')
@UseGuards(JwtAuthGuard)
export class PreferenciasUsuarioController {
  constructor(
    private readonly preferenciasService: PreferenciasUsuarioService,
  ) {}

  @Get()
  async findOne(@CurrentUser() user: Usuario) {
    return this.preferenciasService.findByUsuarioId(user.id);
  }

  @Put()
  async update(
    @CurrentUser() user: Usuario,
    @Body() updateDto: UpdatePreferenciasUsuarioDto,
  ) {
    return this.preferenciasService.update(user.id, updateDto);
  }
}
