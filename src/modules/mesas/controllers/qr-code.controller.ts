import { Controller, Post, Body, Get, Param, Logger } from '@nestjs/common';
import { QrCodeService } from '../services/qr-code.service';
import { QrCodeDto } from '../dtos/qr-code.dto';
import { MesaService } from '../services/mesa.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('qr-code')
export class QrCodeController {
  private readonly logger = new Logger(QrCodeController.name);

  constructor(
    private readonly qrCodeService: QrCodeService,
    private readonly mesaService: MesaService,
  ) {}

  @Post('gerar')
  async gerarQrCode(@Body() data: { num_cnpj: string; numMesa: string }) {
    this.logger.log(`Gerando QR Code para mesa ${data.numMesa} do estabelecimento ${data.num_cnpj}`);
    const qrCode = this.qrCodeService.gerarQrCode(data.num_cnpj, data.numMesa);
    this.logger.log(`QR Code gerado com sucesso: ${qrCode}`);
    return { qrCode };
  }

  @Post('validar')
  async validarQrCode(@Body() data: { qrCode: string }) {
    this.logger.log(`Validando QR Code: ${data.qrCode}`);
    const result = this.qrCodeService.validarQrCode(data.qrCode);
    this.logger.log(`QR Code validado com sucesso: ${JSON.stringify(result)}`);
    return result;
  }

  @Public()
  @Get('mesa/:num_cnpj/:numMesa/disponibilidade')
  async verificarDisponibilidade(
    @Param('num_cnpj') num_cnpj: string,
    @Param('numMesa') numMesa: string,
  ) {
    this.logger.log(`Verificando disponibilidade da mesa ${numMesa} do estabelecimento ${num_cnpj}`);
    const disponivel = await this.qrCodeService.verificarDisponibilidadeMesa(num_cnpj, numMesa);
    this.logger.log(`Mesa ${numMesa} está ${disponivel ? 'disponível' : 'indisponível'}`);
    return { disponivel };
  }

  @Post('mesa/ocupar')
  async ocuparMesa(@Body() data: { num_cnpj: string; numMesa: string }) {
    this.logger.log(`Ocupando mesa ${data.numMesa} do estabelecimento ${data.num_cnpj}`);
    await this.qrCodeService.ocuparMesa(data.num_cnpj, data.numMesa);
    this.logger.log(`Mesa ${data.numMesa} ocupada com sucesso`);
    return { message: 'Mesa ocupada com sucesso' };
  }

  @Post('mesa/liberar')
  async liberarMesa(@Body() data: { num_cnpj: string; numMesa: string }) {
    this.logger.log(`Liberando mesa ${data.numMesa} do estabelecimento ${data.num_cnpj}`);
    await this.qrCodeService.liberarMesa(data.num_cnpj, data.numMesa);
    this.logger.log(`Mesa ${data.numMesa} liberada com sucesso`);
    return { message: 'Mesa liberada com sucesso' };
  }

  @Get('estabelecimento/:cnpj')
  async getQrCodesEstabelecimento(@Param('cnpj') cnpj: string) {
    this.logger.log(`Buscando QR Codes do estabelecimento ${cnpj}`);
    const qrCodes = await this.qrCodeService.getQrCodesEstabelecimento(cnpj);
    this.logger.log(`Encontrados ${qrCodes.length} QR Codes para o estabelecimento ${cnpj}`);
    return qrCodes;
  }
}
