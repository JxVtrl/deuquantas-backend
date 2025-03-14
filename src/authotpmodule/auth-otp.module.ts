import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { AuthOtpService } from './auth-otp.service';
import { AuthOtpController } from './auth-otp.controller';
import serviceAccount from '../serviceAccountKey.json';

@Module({
  providers: [
    AuthOtpService,
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: () => {
        return admin.initializeApp({
          credential: admin.credential.cert(
            serviceAccount as admin.ServiceAccount,
          ),
        });
      },
    },
  ],
  controllers: [AuthOtpController],
})
export class AuthOtpModule {}
