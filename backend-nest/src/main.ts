import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  
  const allowedOrigins = [
    'http://localhost:5173', // Local development
    'https://messaging-system-navy.vercel.app', // Your Vercel domain
    'https://messaging-system-n0wz.onrender.com', // Your Render backend domain
    process.env.FRONTEND_URL // Environment variable for production
  ].filter(Boolean); // Remove any undefined values
  
  console.log('Allowed CORS origins:', allowedOrigins);
  
  app.enableCors({ 
    origin: true, // Allow all origins for testing
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
  });
  
  // Increase body size limits for file uploads
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
