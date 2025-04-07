import { Controller, Get, Put, Body, UseGuards, Logger } from '@nestjs/common';
import { PreferenciasUsuarioService } from '../services/preferencias-usuario.service';
import { UpdatePreferenciasUsuarioDto } from '../dto/update-preferencias-usuario.dto';
import { CurrentUser } from '../../../auth/decorators/current-user.decorator';
import { Usuario } from '../usuario.entity';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@Controller('preferencias')
@UseGuards(JwtAuthGuard)
export class PreferenciasUsuarioController {
  private readonly logger = new Logger(PreferenciasUsuarioController.name);

  constructor(
    private readonly preferenciasService: PreferenciasUsuarioService,
  ) {}

  @Get()
  async findOne(@CurrentUser() user: Usuario) {
    this.logger.log(`Buscando preferências do usuário com ID: ${user.id}`);
    const preferencias = await this.preferenciasService.findByUsuarioId(
      user.id,
    );
    this.logger.log(
      `Preferências ${preferencias ? 'encontradas' : 'não encontradas'} para o usuário: ${user.id}`,
    );
    return preferencias;
  }

  @Put()
  async update(
    @CurrentUser() user: Usuario,
    @Body() updateDto: UpdatePreferenciasUsuarioDto,
  ) {
    this.logger.log(`Atualizando preferências do usuário com ID: ${user.id}`);
    const preferencias = await this.preferenciasService.update(
      user.id,
      updateDto,
    );
    this.logger.log(
      `Preferências atualizadas com sucesso para o usuário: ${user.id}`,
    );
    return preferencias;
  }
}
