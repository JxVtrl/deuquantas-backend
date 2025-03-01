import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../item.entity';
import { CreateItemDto } from '../dtos/item.dto';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async getAllItens(): Promise<Item[]> {
    return this.itemRepository.find();
  }

  async getItemByCodigo(codItem: string): Promise<Item | null> {
    return this.itemRepository.findOne({ where: { codItem } });
  }

  async createItem(dto: CreateItemDto): Promise<Item> {
    const newItem = this.itemRepository.create(dto);
    return this.itemRepository.save(newItem);
  }
}
