import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await app.listen(3000);
}
bootstrap();
