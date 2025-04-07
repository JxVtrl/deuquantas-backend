import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { QrCodeService } from '../services/qr-code.service';
import { QrCodeDto } from '../dtos/qr-code.dto';
import { MesaService } from '../services/mesa.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('qr-code')
export class QrCodeController {
  constructor(
    private readonly qrCodeService: QrCodeService,
    private readonly mesaService: MesaService,
  ) {}

  @Post('gerar')
  gerarQrCode(@Body() data: QrCodeDto): { qrCode: string } {
    const qrCode = this.qrCodeService.gerarQrCode(data.num_cnpj, data.numMesa);
    return { qrCode };
  }

  @Post('validar')
  validarQrCode(@Body('qrCode') qrCode: string): QrCodeDto {
    return this.qrCodeService.validarQrCode(qrCode);
  }

  @Public()
  @Get('mesa/:num_cnpj/:numMesa/disponibilidade')
  async verificarDisponibilidade(
    @Param('num_cnpj') num_cnpj: string,
    @Param('numMesa') numMesa: string,
  ): Promise<{ disponivel: boolean }> {
    const disponivel = await this.qrCodeService.verificarDisponibilidadeMesa(
      num_cnpj,
      numMesa,
    );
    return { disponivel };
  }

  @Post('mesa/ocupar')
  async ocuparMesa(@Body() data: QrCodeDto): Promise<void> {
    await this.qrCodeService.ocuparMesa(data.num_cnpj, data.numMesa);
  }

  @Post('mesa/liberar')
  async liberarMesa(@Body() data: QrCodeDto): Promise<void> {
    await this.qrCodeService.liberarMesa(data.num_cnpj, data.numMesa);
  }

  @Get('estabelecimento/:cnpj')
  async getQrCodesByEstabelecimento(@Param('cnpj') cnpj: string) {
    const mesas = await this.mesaService.getMesasByEstabelecimento(cnpj);
    return mesas.map((mesa) => ({
      numMesa: mesa.numMesa,
      qrCode: mesa.qrCode,
      status: mesa.status,
    }));
  }
}
