import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreferenciasUsuario } from '../entities/preferencias-usuario.entity';
import { UpdatePreferenciasUsuarioDto } from '../dto/update-preferencias-usuario.dto';

@Injectable()
export class PreferenciasUsuarioService {
  private readonly logger = new Logger(PreferenciasUsuarioService.name);

  constructor(
    @InjectRepository(PreferenciasUsuario)
    private preferenciasRepository: Repository<PreferenciasUsuario>,
  ) {}

  async findByUsuarioId(usuarioId: string): Promise<PreferenciasUsuario> {
    this.logger.log(
      `Buscando preferências do usuário com ID: ${usuarioId} no banco de dados`,
    );
    const preferencias = await this.preferenciasRepository.findOne({
      where: { usuario: { id: usuarioId } },
    });
    if (!preferencias) {
      this.logger.log(
        `Preferências não encontradas para o usuário: ${usuarioId}. Criando novas preferências.`,
      );
      return this.create(usuarioId);
    }
    this.logger.log(`Preferências encontradas para o usuário: ${usuarioId}`);
    return preferencias;
  }

  async create(usuarioId: string): Promise<PreferenciasUsuario> {
    this.logger.log(`Criando novas preferências para o usuário: ${usuarioId}`);
    const preferencias = this.preferenciasRepository.create({
      usuario: { id: usuarioId },
    });
    const savedPreferencias =
      await this.preferenciasRepository.save(preferencias);
    this.logger.log(
      `Preferências criadas com sucesso para o usuário: ${usuarioId}`,
    );
    return savedPreferencias;
  }

  async update(
    usuarioId: string,
    updateDto: UpdatePreferenciasUsuarioDto,
  ): Promise<PreferenciasUsuario> {
    this.logger.log(`Atualizando preferências do usuário: ${usuarioId}`);
    const preferencias = await this.findByUsuarioId(usuarioId);
    if (!preferencias) {
      this.logger.log(
        `Preferências não encontradas para o usuário: ${usuarioId}. Criando novas preferências.`,
      );
      return this.create(usuarioId);
    }

    Object.assign(preferencias, updateDto);
    const updatedPreferencias =
      await this.preferenciasRepository.save(preferencias);
    this.logger.log(
      `Preferências atualizadas com sucesso para o usuário: ${usuarioId}`,
    );
    return updatedPreferencias;
  }
}
