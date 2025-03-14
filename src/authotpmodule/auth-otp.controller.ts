import { Controller, Post, Body } from '@nestjs/common';
import { AuthOtpService } from './auth-otp.service';

@Controller('auth-otp')
export class AuthOtpController {
  constructor(private readonly authOtpService: AuthOtpService) {}

  @Post('send-otp')
  async sendOtp(
    @Body('phone') phoneNumber: string,
  ): Promise<{ message: string; session: string }> {
    const { session } = await this.authOtpService.sendOtp(phoneNumber);
    return { message: 'OTP enviado com sucesso', session };
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body('token') idToken: string,
  ): Promise<{ message: string; user: { uid: string; phone: string } }> {
    const userData = await this.authOtpService.verifyOtp(idToken);
    return { message: 'Autenticação bem-sucedida', user: userData };
  }
}
