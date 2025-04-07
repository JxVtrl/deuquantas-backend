import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mesa } from '../mesa.entity';
import { QrCodeDto } from '../dtos/qr-code.dto';

@Injectable()
export class QrCodeService {
  constructor(
    @InjectRepository(Mesa)
    private readonly mesaRepository: Repository<Mesa>,
  ) {}

  gerarQrCode(num_cnpj: string, numMesa: string): string {
    return `estabelecimento:${num_cnpj}:mesa:${numMesa}`;
  }

  validarQrCode(qrCode: string): QrCodeDto {
    const partes = qrCode.split(':');

    if (
      partes.length !== 4 ||
      partes[0] !== 'estabelecimento' ||
      partes[2] !== 'mesa'
    ) {
      throw new Error('QR Code inválido');
    }

    return {
      num_cnpj: partes[1],
      numMesa: partes[3],
    };
  }

  async verificarDisponibilidadeMesa(
    num_cnpj: string,
    numMesa: string,
  ): Promise<boolean> {
    const mesa = await this.mesaRepository.findOne({
      where: {
        num_cnpj,
        numMesa,
        status: 'disponivel',
        is_ativo: true,
      },
    });

    return !!mesa;
  }

  async ocuparMesa(num_cnpj: string, numMesa: string): Promise<void> {
    await this.mesaRepository.update(
      { num_cnpj, numMesa },
      { status: 'ocupada' },
    );
  }

  async liberarMesa(num_cnpj: string, numMesa: string): Promise<void> {
    await this.mesaRepository.update(
      { num_cnpj, numMesa },
      { status: 'disponivel' },
    );
  }
}
