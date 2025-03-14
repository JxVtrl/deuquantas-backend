import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ItemService } from '../services/item.service';
import { CreateItemDto } from '../dtos/item.dto';
import { AuthGuard } from '../../../auth/auth.guard';
import { RolesGuard } from '../../../auth/role.guard';
import { Roles } from '../../../auth/roles.decorator';

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

  @Roles('gerente')
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  async createItem(@Body() createItemDto: CreateItemDto) {
    return this.itemService.createItem(createItemDto);
  }
}
