// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cors from 'cors';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cors());
  app.setGlobalPrefix('api');

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Sistema Entrada QR')
    .setDescription('API para control de asistencia con QR')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT-auth')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
  console.log(`Backend corriendo en http://localhost:3000`);
  console.log(`Swagger docs en http://localhost:3000/api-docs`);
}

bootstrap();


