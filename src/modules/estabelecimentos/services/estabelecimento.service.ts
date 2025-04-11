import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estabelecimento } from '../estabelecimento.entity';
import { CreateEstabelecimentoDto } from '../dtos/estabelecimento.dto';

@Injectable()
export class EstabelecimentoService {
  private readonly logger = new Logger(EstabelecimentoService.name);

  constructor(
    @InjectRepository(Estabelecimento)
    private readonly estabelecimentoRepository: Repository<Estabelecimento>,
  ) {}

  private calcularDistancia(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distância em km
  }

  async buscarEstabelecimentosProximos(
    latitude: number,
    longitude: number,
    raioKm: number,
  ): Promise<Estabelecimento[]> {
    this.logger.log(
      `Buscando estabelecimentos próximos - latitude: ${latitude}, longitude: ${longitude}, raio: ${raioKm}km`,
    );

    const estabelecimentos = await this.estabelecimentoRepository
      .createQueryBuilder('estabelecimento')
      .where(
        `ST_DistanceSphere(
          ST_MakePoint(estabelecimento.longitude, estabelecimento.latitude),
          ST_MakePoint(:longitude, :latitude)
        ) <= :raio`,
        { latitude, longitude, raio: raioKm * 1000 }, // Convertendo para metros
      )
      .getMany();

    this.logger.log(
      `Encontrados ${estabelecimentos.length} estabelecimentos próximos`,
    );
    return estabelecimentos;
  }

  async getAllEstabelecimentos(): Promise<Estabelecimento[]> {
    this.logger.log('Buscando todos os estabelecimentos no banco de dados');
    const estabelecimentos = await this.estabelecimentoRepository.find();
    this.logger.log(
      `Retornando ${estabelecimentos.length} estabelecimentos do banco de dados`,
    );
    return estabelecimentos;
  }

  async getEstabelecimentoByCnpj(
    num_cnpj: string,
  ): Promise<Estabelecimento | null> {
    this.logger.log(
      `Buscando estabelecimento para o CNPJ: ${num_cnpj} no banco de dados`,
    );
    const estabelecimento = await this.estabelecimentoRepository.findOne({
      where: { num_cnpj },
      relations: ['usuario'],
    });
    this.logger.log(
      `Estabelecimento ${estabelecimento ? 'encontrado' : 'não encontrado'} para o CNPJ: ${num_cnpj}`,
    );
    return estabelecimento;
  }

  async createEstabelecimento(
    dto: CreateEstabelecimentoDto,
  ): Promise<Estabelecimento> {
    this.logger.log(
      `Criando novo estabelecimento no banco de dados para o CNPJ: ${dto.num_cnpj}`,
    );
    const newEstabelecimento = this.estabelecimentoRepository.create(dto);
    const savedEstabelecimento =
      await this.estabelecimentoRepository.save(newEstabelecimento);
    this.logger.log(
      `Estabelecimento criado com sucesso no banco de dados. CNPJ: ${savedEstabelecimento.num_cnpj}`,
    );
    return savedEstabelecimento;
  }

  async findByCNPJ(num_cnpj: string): Promise<Estabelecimento> {
    this.logger.log(
      `Buscando estabelecimento para o CNPJ: ${num_cnpj} no banco de dados`,
    );
    const estabelecimento = await this.estabelecimentoRepository.findOne({
      where: { num_cnpj },
    });

    if (!estabelecimento) {
      this.logger.error(
        `Estabelecimento não encontrado para o CNPJ: ${num_cnpj}`,
      );
      throw new NotFoundException('Estabelecimento não encontrado');
    }

    this.logger.log(`Estabelecimento encontrado para o CNPJ: ${num_cnpj}`);
    return estabelecimento;
  }

  async findByUsuarioId(usuarioId: string): Promise<Estabelecimento> {
    this.logger.log(
      `Buscando estabelecimento para o usuário: ${usuarioId} no banco de dados`,
    );

    const estabelecimento = await this.estabelecimentoRepository
      .createQueryBuilder('estabelecimento')
      .leftJoinAndSelect('estabelecimento.usuario', 'usuario')
      .where('usuario.id = :usuarioId', { usuarioId })
      .getOne();

    if (!estabelecimento) {
      this.logger.error(
        `Estabelecimento não encontrado para o usuário: ${usuarioId}`,
      );
      throw new NotFoundException('Estabelecimento não encontrado');
    }

    this.logger.log(`Estabelecimento encontrado para o usuário: ${usuarioId}`);
    return estabelecimento;
  }

  async findByEmail(email: string): Promise<Estabelecimento> {
    this.logger.log(
      `Buscando estabelecimento para o email: ${email} no banco de dados`,
    );
    const estabelecimento = await this.estabelecimentoRepository.findOne({
      where: { usuario: { email } },
      relations: ['usuario'],
    });

    if (!estabelecimento) {
      this.logger.error(
        `Estabelecimento não encontrado para o email: ${email}`,
      );
      throw new NotFoundException('Estabelecimento não encontrado');
    }

    this.logger.log(`Estabelecimento encontrado para o email: ${email}`);
    return estabelecimento;
  }

  async checkPhoneExists(num_celular: string): Promise<boolean> {
    this.logger.log(
      `Verificando existência do telefone: ${num_celular} no banco de dados`,
    );
    const estabelecimento = await this.estabelecimentoRepository.findOne({
      where: { num_celular },
    });

    const exists = !!estabelecimento;
    this.logger.log(
      `Telefone ${num_celular} ${exists ? 'existe' : 'não existe'} no banco de dados`,
    );
    return exists;
  }

  async getEstabelecimentoByUsuarioId(
    usuarioId: string,
  ): Promise<Estabelecimento> {
    this.logger.log(
      `Buscando estabelecimento para o usuário: ${usuarioId} no banco de dados`,
    );

    try {
      if (!usuarioId) {
        this.logger.error('ID do usuário não fornecido');
        throw new NotFoundException('ID do usuário não fornecido');
      }

      const estabelecimento = await this.estabelecimentoRepository
        .createQueryBuilder('estabelecimento')
        .leftJoinAndSelect('estabelecimento.usuario', 'usuario')
        .where('usuario.id = :usuarioId', { usuarioId })
        .getOne();

      if (!estabelecimento) {
        this.logger.error(
          `Estabelecimento não encontrado para o usuário: ${usuarioId}`,
        );
        throw new NotFoundException(
          `Estabelecimento não encontrado para o usuário: ${usuarioId}`,
        );
      }

      this.logger.log(
        `Estabelecimento encontrado para o usuário: ${usuarioId}`,
      );
      return estabelecimento;
    } catch (error) {
      this.logger.error(
        `Erro ao buscar estabelecimento para o usuário ${usuarioId}:`,
        error.stack,
      );

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new Error(`Erro ao buscar estabelecimento: ${error.message}`);
    }
  }
}
