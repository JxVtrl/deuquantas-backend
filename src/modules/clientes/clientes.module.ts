import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './cliente.entity';
import { ClienteRepository } from './cliente.repository';
import { ClienteService } from './services/cliente.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente])],
  providers: [ClienteRepository, ClienteService],
  exports: [ClienteRepository],
})
export class ClientesModule {}
