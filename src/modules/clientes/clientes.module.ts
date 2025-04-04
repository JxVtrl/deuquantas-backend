import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './cliente.entity';
import { ClienteRepository } from './cliente.repository';
import { ClienteService } from './services/cliente.service';
import { ClienteController } from './controllers/cliente.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente])],
  providers: [ClienteRepository, ClienteService],
  controllers: [ClienteController],
  exports: [ClienteService, ClienteRepository],
})
export class ClientesModule {}
