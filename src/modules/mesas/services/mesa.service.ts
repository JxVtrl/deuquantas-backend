import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mesa } from '../mesa.entity';
import { CreateMesaDto, UpdateMesaDto } from '../dtos/mesa.dto';

@Injectable()
export class MesaService {
  constructor(
    @InjectRepository(Mesa)
    private readonly mesaRepository: Repository<Mesa>,
  ) {}

  async getAllMesas(): Promise<Mesa[]> {
    return this.mesaRepository.find();
  }

  async getMesasByEstabelecimento(cnpj: string): Promise<Mesa[]> {
    return this.mesaRepository.find({
      where: { estabelecimento: { num_cnpj: cnpj } },
      relations: ['estabelecimento'],
    });
  }

  async getMesaByNumero(numMesa: string): Promise<Mesa | null> {
    return this.mesaRepository.findOne({ where: { numMesa } });
  }

  async createMesa(dto: CreateMesaDto): Promise<Mesa> {
    const newMesa = this.mesaRepository.create(dto);
    return this.mesaRepository.save(newMesa);
  }

  async updateMesa(numMesa: string, dto: UpdateMesaDto): Promise<Mesa> {
    const mesa = await this.mesaRepository.findOne({ where: { numMesa } });
    if (!mesa) {
      throw new Error('Mesa não encontrada');
    }

    Object.assign(mesa, dto);
    return this.mesaRepository.save(mesa);
  }
}
