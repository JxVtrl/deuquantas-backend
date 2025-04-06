import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import {
  Cardapio,
  Cliente,
  Comanda,
  Conta,
  Estabelecimento,
  Funcionario,
  Item,
  Mesa,
  CardapiosModule,
  ClientesModule,
  ComandasModule,
  ContasModule,
  EstabelecimentosModule,
  FuncionariosModule,
  ItensModule,
  MesasModule,
} from './modules';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { MonitoringModule } from './monitoring/monitoring.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { TestDataModule } from './modules/test-data/test-data.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        console.log('⏳ Aguardando o banco de dados...');
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Aguarda 5 segundos antes de conectar
        console.log('✅ Conectando ao banco de dados!');
        return {
          type: 'postgres',
          host: process.env.DATABASE_HOST || 'localhost',
          port: parseInt(process.env.DATABASE_PORT || '5432', 10),
          username: process.env.DATABASE_USER || 'postgres',
          password: process.env.DATABASE_PASSWORD || 'password',
          database: process.env.DATABASE_NAME || 'deuquantas',
          autoLoadEntities: true,
          synchronize: true, // ⚠️ Apenas para desenvolvimento, desativar em produção!
          logging: true,
        };
      },
    }),
    TypeOrmModule.forFeature([
      Cardapio,
      Cliente,
      Comanda,
      Conta,
      Estabelecimento,
      Funcionario,
      Item,
      Mesa,
    ]),
    MonitoringModule,
    ClientesModule,
    EstabelecimentosModule,
    ComandasModule,
    FuncionariosModule,
    CardapiosModule,
    MesasModule,
    ContasModule,
    ItensModule,
    UsuariosModule,
    TestDataModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // Aplica logs a todas as rotas
  }
}
