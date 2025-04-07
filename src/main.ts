import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthGuard } from './auth/auth.guard';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aplicar AuthGuard globalmente
  app.useGlobalGuards(new AuthGuard(app.get(Reflector)));

  // Configuração do CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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

  // Configuração do ValidationPipe
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3001);
}
bootstrap();
