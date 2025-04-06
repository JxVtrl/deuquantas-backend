import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuario.entity';
import { PreferenciasUsuario } from './entities/preferencias-usuario.entity';
import { UsuarioService } from './services/usuario.service';
import { PreferenciasUsuarioService } from './services/preferencias-usuario.service';
import { UsuarioController } from './controllers/usuario.controller';
import { PreferenciasUsuarioController } from './controllers/preferencias-usuario.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, PreferenciasUsuario])],
  controllers: [UsuarioController, PreferenciasUsuarioController],
  providers: [UsuarioService, PreferenciasUsuarioService],
  exports: [UsuarioService, PreferenciasUsuarioService],
})
export class UsuariosModule {}
