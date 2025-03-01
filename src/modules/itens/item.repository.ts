import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './item.entity';

@Injectable()
export class ItemRepository {
  constructor(
    @InjectRepository(Item)
    private readonly repository: Repository<Item>,
  ) {}

  async findAll(): Promise<Item[]> {
    return this.repository.find();
  }

  async findByNome(desItem: string): Promise<Item | null> {
    return this.repository.findOne({ where: { desItem } });
  }
}
