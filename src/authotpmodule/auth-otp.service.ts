import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthOtpService {
  constructor(@Inject('FIREBASE_ADMIN') private firebase: admin.app.App) {}

  async sendOtp(phoneNumber: string): Promise<{ session: string }> {
    try {
      const session = await this.firebase
        .auth()
        .createSessionCookie(phoneNumber, {
          expiresIn: 5 * 60 * 1000, // OTP válido por 5 minutos
        });

      return { session };
    } catch (error) {
      console.error('Erro ao gerar OTP:', error);
      throw new Error('Erro ao enviar OTP');
    }
  }

  async verifyOtp(idToken: string): Promise<{ uid: string; phone: string }> {
    try {
      const decodedToken = await this.firebase.auth().verifyIdToken(idToken);
      return { uid: decodedToken.uid, phone: decodedToken.phone_number || '' };
    } catch (error) {
      console.error('Erro ao verificar OTP:', error);
      throw new Error('Código inválido ou expirado');
    }
  }
}
