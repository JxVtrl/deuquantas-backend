import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './cliente.entity';
import { ClienteRepository } from './cliente.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente])],
  providers: [ClienteRepository],
  exports: [ClienteRepository],
})
export class ClientesModule {}
