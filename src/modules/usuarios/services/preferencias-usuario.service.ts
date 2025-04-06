import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreferenciasUsuario } from '../entities/preferencias-usuario.entity';
import { UpdatePreferenciasUsuarioDto } from '../dto/update-preferencias-usuario.dto';

@Injectable()
export class PreferenciasUsuarioService {
  constructor(
    @InjectRepository(PreferenciasUsuario)
    private preferenciasRepository: Repository<PreferenciasUsuario>,
  ) {}

  async findByUsuarioId(usuarioId: string): Promise<PreferenciasUsuario> {
    const preferencias = await this.preferenciasRepository.findOne({
      where: { usuario: { id: usuarioId } },
    });
    if (!preferencias) {
      return this.create(usuarioId);
    }
    return preferencias;
  }

  async create(usuarioId: string): Promise<PreferenciasUsuario> {
    const preferencias = this.preferenciasRepository.create({
      usuario: { id: usuarioId },
    });
    return this.preferenciasRepository.save(preferencias);
  }

  async update(
    usuarioId: string,
    updateDto: UpdatePreferenciasUsuarioDto,
  ): Promise<PreferenciasUsuario> {
    const preferencias = await this.findByUsuarioId(usuarioId);
    if (!preferencias) {
      return this.create(usuarioId);
    }

    Object.assign(preferencias, updateDto);
    return this.preferenciasRepository.save(preferencias);
  }
}
