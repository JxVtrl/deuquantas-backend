import { Injectable } from '@nestjs/common';
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

  async getAllEstabelecimentos(): Promise<Estabelecimento[]> {
    return this.estabelecimentoRepository.find();
  }

  async getEstabelecimentoByCnpj(numCnpj: string): Promise<Estabelecimento | null> {
    return this.estabelecimentoRepository.findOne({ where: { numCnpj } });
  }

  async createEstabelecimento(dto: CreateEstabelecimentoDto): Promise<Estabelecimento> {
    const newEstabelecimento = this.estabelecimentoRepository.create(dto);
    return this.estabelecimentoRepository.save(newEstabelecimento);
  }
}
