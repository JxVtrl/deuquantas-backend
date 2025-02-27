import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User, Table, Order, Payment, MenuItem } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'password',
      database: process.env.DATABASE_NAME || 'deuquantas',
      autoLoadEntities: true,
      synchronize: true, // ⚠️ Apenas para desenvolvimento, desativar em produção!
    }),
    TypeOrmModule.forFeature([User, Table, Order, Payment, MenuItem]),
  ],
})
export class AppModule {}
