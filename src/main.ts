import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthGuard } from './auth/auth.guard';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aplicar AuthGuard globalmente
  app.useGlobalGuards(new AuthGuard(app.get(Reflector)));

  // Habilitar CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:3004',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  // Configurar o Swagger
  const config = new DocumentBuilder()
    .setTitle('DeuQuantas API')
    .setDescription('Documentação completo da API do DeuQuantas')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'Insira o token JWT aqui',
      in: 'header',
    }) // Adiciona autenticação JWT se necessário
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Define o endpoint /api

  await app.listen(3001);
}
bootstrap();
