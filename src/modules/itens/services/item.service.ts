import { Injectable } from '@nestjs/common';
import { ItemRepository } from '../item.repository';

@Injectable()
export class ItemService {
  constructor(private readonly itemRepository: ItemRepository) {}

  async getAllItems() {
    return this.itemRepository.findAll();
  }
}
