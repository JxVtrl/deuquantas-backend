import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { ClienteService } from '../modules/clientes/services/cliente.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from '../modules/clientes/cliente.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Cliente]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'segredo-muito-seguro',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ClienteService],
})
export class AuthModule {}
