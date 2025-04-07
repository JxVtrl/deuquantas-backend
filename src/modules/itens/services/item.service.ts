import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../item.entity';
import { CreateItemDto } from '../dtos/item.dto';

@Injectable()
export class ItemService {
  private readonly logger = new Logger(ItemService.name);

  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async getAllItens(): Promise<Item[]> {
    this.logger.log('Buscando todos os itens no banco de dados');
    const itens = await this.itemRepository.find();
    this.logger.log(`Encontrados ${itens.length} itens no banco de dados`);
    return itens;
  }

  async getItemByCodigo(codItem: string): Promise<Item | null> {
    this.logger.log(`Buscando item com código: ${codItem} no banco de dados`);
    const item = await this.itemRepository.findOne({ where: { codItem } });
    this.logger.log(`Item ${item ? 'encontrado' : 'não encontrado'} com código: ${codItem} no banco de dados`);
    return item;
  }

  async createItem(dto: CreateItemDto): Promise<Item> {
    this.logger.log(`Criando novo item com código: ${dto.codItem} no banco de dados`);
    const newItem = this.itemRepository.create(dto);
    const savedItem = await this.itemRepository.save(newItem);
    this.logger.log(`Item criado com sucesso no banco de dados. Código: ${savedItem.codItem}`);
    return savedItem;
  }
}
