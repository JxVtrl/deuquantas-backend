import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mesa } from '../mesa.entity';
import { QrCodeDto } from '../dtos/qr-code.dto';

@Injectable()
export class QrCodeService {
  private readonly logger = new Logger(QrCodeService.name);

  constructor(
    @InjectRepository(Mesa, 'default')
    private readonly mesaRepository: Repository<Mesa>,
  ) {}

  gerarQrCode(num_cnpj: string, numMesa: string): string {
    this.logger.log(
      `Gerando QR Code para mesa ${numMesa} do estabelecimento ${num_cnpj}`,
    );
    const qrCode = `estabelecimento:${num_cnpj}:mesa:${numMesa}`;
    this.logger.log(`QR Code gerado: ${qrCode}`);
    return qrCode;
  }

  validarQrCode(qrCode: string): QrCodeDto {
    this.logger.log(`Validando QR Code: ${qrCode}`);
    const partes = qrCode.split(':');

    if (
      partes.length !== 4 ||
      partes[0] !== 'estabelecimento' ||
      partes[2] !== 'mesa'
    ) {
      this.logger.error(`QR Code inválido: ${qrCode}`);
      throw new Error('QR Code inválido');
    }

    const result = {
      num_cnpj: partes[1],
      numMesa: partes[3],
    };

    this.logger.log(`QR Code validado com sucesso: ${JSON.stringify(result)}`);
    return result;
  }

  async verificarDisponibilidadeMesa(
    num_cnpj: string,
    numMesa: string,
  ): Promise<boolean> {
    this.logger.log(
      `Verificando disponibilidade da mesa ${numMesa} do estabelecimento ${num_cnpj}`,
    );

    const mesa = await this.mesaRepository.findOne({
      where: {
        num_cnpj,
        numMesa,
        status: 'disponivel',
        is_ativo: true,
      },
    });

    const disponivel = !!mesa;
    this.logger.log(
      `Mesa ${numMesa} está ${disponivel ? 'disponível' : 'indisponível'}`,
    );
    return disponivel;
  }

  async ocuparMesa(num_cnpj: string, numMesa: string): Promise<void> {
    this.logger.log(`Ocupando mesa ${numMesa} do estabelecimento ${num_cnpj}`);

    await this.mesaRepository.update(
      { num_cnpj, numMesa },
      { status: 'ocupada' },
    );

    this.logger.log(`Mesa ${numMesa} ocupada com sucesso`);
  }

  async liberarMesa(num_cnpj: string, numMesa: string): Promise<void> {
    this.logger.log(`Liberando mesa ${numMesa} do estabelecimento ${num_cnpj}`);

    await this.mesaRepository.update(
      { num_cnpj, numMesa },
      { status: 'disponivel' },
    );

    this.logger.log(`Mesa ${numMesa} liberada com sucesso`);
  }

  async getQrCodesEstabelecimento(cnpj: string) {
    this.logger.log(`Buscando QR Codes do estabelecimento ${cnpj}`);

    const mesas = await this.mesaRepository.find({
      where: { num_cnpj: cnpj },
      select: ['numMesa', 'qrCode', 'status'],
    });

    this.logger.log(
      `Encontrados ${mesas.length} QR Codes para o estabelecimento ${cnpj}`,
    );
    return mesas;
  }
}
