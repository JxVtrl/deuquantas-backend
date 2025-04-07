import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ItemService } from '../services/item.service';
import { CreateItemDto } from '../dtos/item.dto';
import { AuthGuard } from '../../../auth/auth.guard';
import { RolesGuard } from '../../../auth/role.guard';

@Controller('itens')
export class ItemController {
  private readonly logger = new Logger(ItemController.name);

  constructor(private readonly itemService: ItemService) {}

  @Get()
  async getAllItens() {
    this.logger.log('Buscando todos os itens');
    const itens = await this.itemService.getAllItens();
    this.logger.log(`Encontrados ${itens.length} itens`);
    return itens;
  }

  @Get(':codItem')
  async getItemByCodigo(@Param('codItem') codItem: string) {
    this.logger.log(`Buscando item com código: ${codItem}`);
    const item = await this.itemService.getItemByCodigo(codItem);
    this.logger.log(
      `Item ${item ? 'encontrado' : 'não encontrado'} com código: ${codItem}`,
    );
    return item;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  async createItem(@Body() createItemDto: CreateItemDto) {
    this.logger.log(`Criando novo item com código: ${createItemDto.codItem}`);
    const item = await this.itemService.createItem(createItemDto);
    this.logger.log(`Item criado com sucesso. Código: ${item.codItem}`);
    return item;
  }
}
