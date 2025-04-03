import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estabelecimento } from '../estabelecimento.entity';
import { CreateEstabelecimentoDto } from '../dtos/estabelecimento.dto';

@Injectable()
export class EstabelecimentoService {
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
    console.log('🔎 BUSCANDO ESTABELECIMENTOS PRÓXIMOS:', {
      latitude,
      longitude,
      raioKm,
    });

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

    console.log('📌 RESULTADO DA BUSCA:', estabelecimentos);
    return estabelecimentos;
  }

  async getAllEstabelecimentos(): Promise<Estabelecimento[]> {
    return this.estabelecimentoRepository.find();
  }

  async getEstabelecimentoByCnpj(
    numCnpj: string,
  ): Promise<Estabelecimento | null> {
    return this.estabelecimentoRepository.findOne({ where: { numCnpj } });
  }

  async createEstabelecimento(
    dto: CreateEstabelecimentoDto,
  ): Promise<Estabelecimento> {
    const newEstabelecimento = this.estabelecimentoRepository.create(dto);
    return this.estabelecimentoRepository.save(newEstabelecimento);
  }

  async findByCNPJ(numCnpj: string): Promise<Estabelecimento> {
    const estabelecimento = await this.estabelecimentoRepository.findOne({
      where: { numCnpj },
    });

    if (!estabelecimento) {
      throw new NotFoundException('Estabelecimento não encontrado');
    }

    return estabelecimento;
  }

  async findByUsuarioId(usuarioId: string): Promise<Estabelecimento> {
    const estabelecimento = await this.estabelecimentoRepository.findOne({
      where: { usuario: { id: usuarioId } },
      relations: ['usuario', 'cardapios'],
    });

    if (!estabelecimento) {
      throw new NotFoundException('Estabelecimento não encontrado');
    }

    return estabelecimento;
  }

  async checkPhoneExists(numCelular: string): Promise<boolean> {
    const estabelecimento = await this.estabelecimentoRepository.findOne({
      where: { numCelular },
    });

    return !!estabelecimento;
  }
}
