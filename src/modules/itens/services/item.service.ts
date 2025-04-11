import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

  async getItemById(id: string): Promise<Item | null> {
    this.logger.log(`Buscando item com código: ${id} no banco de dados`);
    const item = await this.itemRepository.findOne({ where: { id } });
    this.logger.log(
      `Item ${item ? 'encontrado' : 'não encontrado'} com código: ${id} no banco de dados`,
    );
    return item;
  }

  async getItensByEstabelecimento(cnpj: string): Promise<Item[]> {
    this.logger.log(`Buscando itens do estabelecimento: ${cnpj}`);
    const itens = await this.itemRepository.find({
      where: { estabelecimento_id: cnpj },
    });
    this.logger.log(
      `Encontrados ${itens.length} itens para o estabelecimento ${cnpj}`,
    );
    return itens;
  }

  async getItemByIdAndEstabelecimento(id: string, cnpj: string): Promise<Item> {
    this.logger.log(`Buscando item ${id} do estabelecimento: ${cnpj}`);
    const item = await this.itemRepository.findOne({
      where: { id, estabelecimento_id: cnpj },
    });

    if (!item) {
      throw new NotFoundException(
        `Item ${id} não encontrado para o estabelecimento ${cnpj}`,
      );
    }

    return item;
  }

  async createItem(dto: CreateItemDto): Promise<Item> {
    this.logger.log(
      `Criando novo item com código: ${dto.id} para o estabelecimento: ${dto.estabelecimento_id}`,
    );
    const newItem = this.itemRepository.create(dto);
    const savedItem = await this.itemRepository.save(newItem);
    this.logger.log(`Item criado com sucesso. Código: ${savedItem.id}`);
    return savedItem;
  }

  async updateItem(
    id: string,
    cnpj: string,
    updateDto: Partial<CreateItemDto>,
  ): Promise<Item> {
    this.logger.log(`Atualizando item ${id} do estabelecimento: ${cnpj}`);

    // Verifica se o item existe
    const item = await this.getItemByIdAndEstabelecimento(id, cnpj);

    // Atualiza o item
    Object.assign(item, updateDto);
    const updatedItem = await this.itemRepository.save(item);

    this.logger.log(`Item atualizado com sucesso. Código: ${updatedItem.id}`);
    return updatedItem;
  }

  async deleteItem(id: string, cnpj: string): Promise<void> {
    this.logger.log(`Excluindo item ${id} do estabelecimento: ${cnpj}`);

    // Verifica se o item existe
    const item = await this.getItemByIdAndEstabelecimento(id, cnpj);

    // Exclui o item
    await this.itemRepository.remove(item);

    this.logger.log(`Item excluído com sucesso. Código: ${id}`);
  }
}
