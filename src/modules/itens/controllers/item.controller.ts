import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Logger,
  Patch,
  Delete,
} from '@nestjs/common';
import { ItemService } from '../services/item.service';
import { CreateItemDto } from '../dtos/item.dto';
import { AuthGuard } from '../../../auth/auth.guard';
import { RolesGuard } from '../../../auth/role.guard';

@Controller('itens')
export class ItemController {
  private readonly logger = new Logger(ItemController.name);

  constructor(private readonly itemService: ItemService) {}

  @Get(':cnpj')
  async getItensByEstabelecimento(@Param('cnpj') cnpj: string) {
    this.logger.log(`Buscando itens do estabelecimento: ${cnpj}`);
    const itens = await this.itemService.getItensByEstabelecimento(cnpj);
    this.logger.log(
      `Encontrados ${itens.length} itens para o estabelecimento ${cnpj}`,
    );
    return itens;
  }

  @Get(':cnpj/:id')
  async getItemById(@Param('cnpj') cnpj: string, @Param('id') id: string) {
    this.logger.log(`Buscando item ${id} do estabelecimento: ${cnpj}`);
    const item = await this.itemService.getItemByIdAndEstabelecimento(id, cnpj);
    this.logger.log(
      `Item ${item ? 'encontrado' : 'não encontrado'} com código: ${id}`,
    );
    return item;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Post(':cnpj')
  async createItem(
    @Param('cnpj') cnpj: string,
    @Body() createItemDto: CreateItemDto,
  ) {
    this.logger.log(`Criando novo item para o estabelecimento: ${cnpj}`);
    const item = await this.itemService.createItem({
      ...createItemDto,
      estabelecimento_id: cnpj,
    });
    this.logger.log(`Item criado com sucesso. Código: ${item.id}`);
    return item;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':cnpj/:id')
  async updateItem(
    @Param('cnpj') cnpj: string,
    @Param('id') id: string,
    @Body() updateItemDto: Partial<CreateItemDto>,
  ) {
    this.logger.log(`Atualizando item ${id} do estabelecimento: ${cnpj}`);
    const item = await this.itemService.updateItem(id, cnpj, updateItemDto);
    this.logger.log(`Item atualizado com sucesso. Código: ${item.id}`);
    return item;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':cnpj/:id')
  async deleteItem(@Param('cnpj') cnpj: string, @Param('id') id: string) {
    this.logger.log(`Excluindo item ${id} do estabelecimento: ${cnpj}`);
    await this.itemService.deleteItem(id, cnpj);
    this.logger.log(`Item excluído com sucesso. Código: ${id}`);
    return { message: 'Item excluído com sucesso' };
  }
}
