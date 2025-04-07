import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mesa } from './mesa.entity';
import { MesaRepository } from './mesa.repository';
import { MesaService } from './services/mesa.service';
import { MesaController } from './controllers/mesa.controller';
import { QrCodeService } from './services/qr-code.service';
import { QrCodeController } from './controllers/qr-code.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Mesa])],
  providers: [MesaRepository, MesaService, QrCodeService],
  controllers: [MesaController, QrCodeController],
  exports: [MesaRepository, QrCodeService],
})
export class MesasModule {}
