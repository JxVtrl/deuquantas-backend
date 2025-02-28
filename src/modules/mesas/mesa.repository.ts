import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Mesa } from './mesa.entity';

@Injectable()
export class MesaRepository {
  constructor(
    @InjectRepository(Mesa)
    private readonly repository: Repository<Mesa>,
  ) {}

  async findAll(): Promise<Mesa[]> {
    return this.repository.find();
  }
}
