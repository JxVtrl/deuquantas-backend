import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mesa } from '../mesa.entity';
import { CreateMesaDto, UpdateMesaDto } from '../dtos/mesa.dto';
import { QrCodeService } from './qr-code.service';

@Injectable()
export class MesaService {
  constructor(
    @InjectRepository(Mesa)
    private readonly mesaRepository: Repository<Mesa>,
    private readonly qrCodeService: QrCodeService,
  ) {}

  async getAllMesas(): Promise<Mesa[]> {
    return this.mesaRepository.find();
  }

  async getMesasByEstabelecimento(cnpj: string): Promise<Mesa[]> {
    return this.mesaRepository.find({
      where: { estabelecimento: { num_cnpj: cnpj } },
      relations: ['estabelecimento'],
    });
  }

  async getMesaByNumero(numMesa: string): Promise<Mesa | null> {
    return this.mesaRepository.findOne({ where: { numMesa } });
  }

  async createMesa(dto: CreateMesaDto): Promise<Mesa> {
    // Verificar se já existe uma mesa com o mesmo número no mesmo estabelecimento
    const mesaExistente = await this.mesaRepository.findOne({
      where: {
        numMesa: dto.numMesa,
        num_cnpj: dto.num_cnpj,
      },
    });

    if (mesaExistente) {
      throw new Error('Já existe uma mesa com este número no estabelecimento');
    }

    const newMesa = this.mesaRepository.create(dto);
    const mesa = await this.mesaRepository.save(newMesa);

    // Gerar QR Code para a mesa
    const qrCode = this.qrCodeService.gerarQrCode(dto.num_cnpj, mesa.numMesa);
    mesa.qrCode = qrCode;

    return this.mesaRepository.save(mesa);
  }

  async updateMesa(numMesa: string, dto: UpdateMesaDto): Promise<Mesa> {
    const mesa = await this.mesaRepository.findOne({ where: { numMesa } });
    if (!mesa) {
      throw new Error('Mesa não encontrada');
    }

    Object.assign(mesa, dto);
    return this.mesaRepository.save(mesa);
  }
}
