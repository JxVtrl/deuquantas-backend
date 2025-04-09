import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthGuard } from './auth/auth.guard';
import { Reflector } from '@nestjs/core';
import { createServer } from 'http';
import { Server } from 'socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aplicar AuthGuard globalmente
  app.useGlobalGuards(new AuthGuard(app.get(Reflector)));

  // Configuração do CORS
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ],
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'X-Requested-With',
      'Origin',
    ],
    exposedHeaders: ['Authorization'],
    maxAge: 3600,
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
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Configuração do ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Criar servidor HTTP
  const httpServer = createServer(app.getHttpAdapter().getInstance());

  // Configurar Socket.IO
  const io = new Server(httpServer, {
    cors: {
      origin: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
      ],
      methods: ['GET', 'POST'],
      credentials: true,
    },
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    allowEIO3: true,
  });

  // Iniciar servidor HTTP na porta 3001
  await app.listen(3001, '0.0.0.0');

  // Iniciar servidor Socket.IO na porta 3002
  httpServer.listen(3002, '0.0.0.0', () => {
    console.log('Servidor Socket.IO rodando na porta 3002');
  });
}

bootstrap();
