import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mesa } from '../mesa.entity';
import { CreateMesaDto, UpdateMesaDto } from '../dtos/mesa.dto';
import { QrCodeService } from './qr-code.service';
import { Estabelecimento } from '../../estabelecimentos/estabelecimento.entity';

@Injectable()
export class MesaService {
  private readonly logger = new Logger(MesaService.name);

  constructor(
    @InjectRepository(Mesa)
    private readonly mesaRepository: Repository<Mesa>,
    @InjectRepository(Estabelecimento)
    private readonly estabelecimentoRepository: Repository<Estabelecimento>,
    private readonly qrCodeService: QrCodeService,
  ) {}

  async getAllMesas(): Promise<Mesa[]> {
    this.logger.log('Buscando todas as mesas no banco de dados');
    const mesas = await this.mesaRepository.find();
    this.logger.log(`Encontradas ${mesas.length} mesas no banco de dados`);
    return mesas;
  }

  async getMesasByEstabelecimento(cnpj: string): Promise<Mesa[]> {
    this.logger.log(
      `Buscando mesas do estabelecimento: ${cnpj} no banco de dados`,
    );
    const mesas = await this.mesaRepository.find({
      where: { estabelecimento: { num_cnpj: cnpj } },
      relations: ['estabelecimento'],
    });
    this.logger.log(
      `Encontradas ${mesas.length} mesas para o estabelecimento: ${cnpj}`,
    );
    return mesas;
  }

  async getMesaByNumero(numMesa: string): Promise<Mesa | null> {
    this.logger.log(`Buscando mesa número: ${numMesa} no banco de dados`);
    const mesa = await this.mesaRepository.findOne({ where: { numMesa } });
    this.logger.log(
      `Mesa ${mesa ? 'encontrada' : 'não encontrada'} com número: ${numMesa}`,
    );
    return mesa;
  }

  async createMesa(dto: CreateMesaDto): Promise<Mesa> {
    this.logger.log(
      `Iniciando criação de mesa para o estabelecimento: ${dto.num_cnpj}`,
    );

    try {
      // Verificar se o estabelecimento existe
      const estabelecimento = await this.estabelecimentoRepository.findOne({
        where: { num_cnpj: dto.num_cnpj },
      });

      if (!estabelecimento) {
        this.logger.error(`Estabelecimento não encontrado: ${dto.num_cnpj}`);
        throw new NotFoundException(`Estabelecimento não encontrado: ${dto.num_cnpj}`);
      }

      // Verificar se já existe uma mesa com o mesmo número no mesmo estabelecimento
      this.logger.log(
        `Verificando existência de mesa com número: ${dto.numMesa}`,
      );
      const mesaExistente = await this.mesaRepository.findOne({
        where: {
          numMesa: dto.numMesa,
          num_cnpj: dto.num_cnpj,
        },
      });

      if (mesaExistente) {
        this.logger.error(
          `Mesa ${dto.numMesa} já existe no estabelecimento ${dto.num_cnpj}`,
        );
        throw new BadRequestException('Já existe uma mesa com este número no estabelecimento');
      }

      // Criar nova mesa
      this.logger.log('Criando nova mesa no banco de dados');
      const newMesa = this.mesaRepository.create({
        ...dto,
        status: 'disponivel',
        is_ativo: true,
      });

      // Gerar QR Code para a mesa
      this.logger.log(`Gerando QR Code para a mesa ${newMesa.numMesa}`);
      const qrCode = this.qrCodeService.gerarQrCode(dto.num_cnpj, newMesa.numMesa);
      newMesa.qrCode = qrCode;

      // Salvar a mesa
      const mesaSalva = await this.mesaRepository.save(newMesa);
      this.logger.log(
        `Mesa criada com sucesso. Número: ${mesaSalva.numMesa}, CNPJ: ${mesaSalva.num_cnpj}`,
      );
      return mesaSalva;
    } catch (error) {
      this.logger.error(
        `Erro ao criar mesa para o estabelecimento ${dto.num_cnpj}:`,
        error.stack,
      );

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw new Error(`Erro ao criar mesa: ${error.message}`);
    }
  }

  async updateMesa(numMesa: string, dto: UpdateMesaDto): Promise<Mesa> {
    this.logger.log(`Iniciando atualização da mesa número: ${numMesa}`);

    const mesa = await this.mesaRepository.findOne({ where: { numMesa } });
    if (!mesa) {
      this.logger.error(`Mesa ${numMesa} não encontrada`);
      throw new Error('Mesa não encontrada');
    }

    this.logger.log(`Atualizando dados da mesa ${numMesa}`);
    Object.assign(mesa, dto);
    const mesaAtualizada = await this.mesaRepository.save(mesa);
    this.logger.log(
      `Mesa atualizada com sucesso. Número: ${mesaAtualizada.numMesa}, CNPJ: ${mesaAtualizada.num_cnpj}`,
    );
    return mesaAtualizada;
  }
}
