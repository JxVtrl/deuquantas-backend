import { Module, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { AuthOtpService } from './auth-otp.service';
import { AuthOtpController } from './auth-otp.controller';

let serviceAccount;
try {
  serviceAccount = require('../serviceAccountKey.json');
} catch (error) {
  Logger.warn('Arquivo serviceAccountKey.json não encontrado. Firebase será desativado.');
  serviceAccount = null;
}

@Module({
  providers: [
    AuthOtpService,
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: () => {
        if (!serviceAccount) {
          Logger.warn('Firebase não foi inicializado porque as credenciais estão ausentes.');
          return null; // Retorna null para evitar erro
        }

        try {
          return admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
          });
        } catch (error) {
          Logger.error('Erro ao inicializar o Firebase:', error);
          return null; // Garante que o app não quebre caso haja um erro
        }
      },
    },
  ],
  controllers: [AuthOtpController],
})
export class AuthOtpModule {}
