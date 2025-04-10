import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthGuard } from './auth/auth.guard';
import { Reflector } from '@nestjs/core';
import { createServer } from 'http';
import { Server } from 'socket.io';

interface HttpAdapter {
  set(key: string, value: any): void;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aplicar AuthGuard globalmente
  app.useGlobalGuards(new AuthGuard(app.get(Reflector)));

  // Configuração do CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://0.0.0.0:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3001',
      'http://0.0.0.0:3001',
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
        'http://0.0.0.0:3000',
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    },
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Iniciar servidor HTTP na porta 3010
  await app.listen(3010, '0.0.0.0', () => {
    console.log('Servidor HTTP rodando na porta 3010');
  });

  // Iniciar servidor Socket.IO na porta 3011
  httpServer.listen(3011, '0.0.0.0', () => {
    console.log('Servidor Socket.IO rodando na porta 3011');
  });

  // Exportar instância do Socket.IO
  const httpAdapter = app.getHttpAdapter().getInstance() as HttpAdapter;
  httpAdapter.set('io', io);
}

bootstrap();
