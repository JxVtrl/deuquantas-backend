import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comanda } from '../comanda.entity';
import { CreateComandaDto } from '../dtos/comanda.dto';

@Injectable()
export class ComandaService {
  constructor(
    @InjectRepository(Comanda)
    private readonly comandaRepository: Repository<Comanda>,
  ) {}

  async getAllComandas(): Promise<Comanda[]> {
    return this.comandaRepository.find();
  }

  async getComandaByCpf(num_cpf: string): Promise<Comanda[]> {
    return this.comandaRepository.find({ where: { num_cpf } });
  }

  async createComanda(dto: CreateComandaDto): Promise<Comanda> {
    const newComanda = this.comandaRepository.create(dto);
    return this.comandaRepository.save(newComanda);
  }
}
