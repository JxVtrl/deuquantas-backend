import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { ItemRepository } from './item.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Item])],
  providers: [ItemRepository],
  exports: [ItemRepository],
})
export class ItensModule {}
