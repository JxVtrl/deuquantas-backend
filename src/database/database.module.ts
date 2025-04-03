import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
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
  ],
})
export class DatabaseModule {}
