import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestComanda } from '../test-comanda.entity';
import { CreateComandaDto } from '../dtos/comanda.dto';

@Injectable()
export class TestComandaService {
  constructor(
    @InjectRepository(TestComanda)
    private readonly testComandaRepository: Repository<TestComanda>,
  ) {}

  async getAllTestComandas(): Promise<TestComanda[]> {
    return this.testComandaRepository.find();
  }

  async getTestComandaByCpf(numCpf: string): Promise<TestComanda[]> {
    return this.testComandaRepository.find({ where: { numCpf } });
  }

  async createTestComanda(dto: CreateComandaDto): Promise<TestComanda> {
    // Converter as datas de string para Date
    const testComandaData = {
      ...dto,
      datApropriacao: new Date(dto.datApropriacao),
      horPedido: new Date(dto.horPedido),
      isTestData: true
    };
    
    const newTestComanda = this.testComandaRepository.create(testComandaData);
    return this.testComandaRepository.save(newTestComanda);
  }
} 