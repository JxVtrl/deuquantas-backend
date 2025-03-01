import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ItemService } from '../services/item.service';
import { CreateItemDto } from '../dtos/item.dto';

@Controller('itens')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  async getAllItens() {
    return this.itemService.getAllItens();
  }

  @Get(':codItem')
  async getItemByCodigo(@Param('codItem') codItem: string) {
    return this.itemService.getItemByCodigo(codItem);
  }

  @Post()
  async createItem(@Body() createItemDto: CreateItemDto) {
    return this.itemService.createItem(createItemDto);
  }
}
