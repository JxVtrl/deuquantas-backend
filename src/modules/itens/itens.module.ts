import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { ItemRepository } from './item.repository';
import { ItemService } from './services/item.service';
import { ItemController } from './controllers/item.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Item])],
  providers: [ItemRepository, ItemService],
  controllers: [ItemController],
  exports: [ItemRepository],
})
export class ItensModule {}
