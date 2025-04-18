import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { UsuariosModule } from '../modules/usuarios/usuarios.module';
import { ClientesModule } from '../modules/clientes/clientes.module';
import { EstabelecimentosModule } from '../modules/estabelecimentos/estabelecimentos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from '../modules/clientes/cliente.entity';
import { Estabelecimento } from '../modules/estabelecimentos/estabelecimento.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsuariosModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'sua-chave-secreta',
      signOptions: { expiresIn: '7d' },
    }),
    ClientesModule,
    EstabelecimentosModule,
    TypeOrmModule.forFeature([Cliente, Estabelecimento]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
