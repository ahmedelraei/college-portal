import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { SeederService } from './lib/services/seeder.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Register cookie support
  await app.register(require('@fastify/cookie'));

  // Register session plugin for Fastify
  await app.register(require('@fastify/session'), {
    secret:
      process.env.SESSION_SECRET ||
      'your-super-secret-session-key-change-this-in-production',
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax',
    },
  });

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Run database seeding
  const seederService = app.get(SeederService);
  await seederService.seedAll();

  await app.listen(process.env.PORT ?? 8080, '0.0.0.0');
  console.log(
    `🚀 College Portal API is running on: http://localhost:${process.env.PORT ?? 8080}`,
  );
  console.log(
    `🚀 GraphQL Playground: http://localhost:${process.env.PORT ?? 8080}/graphql`,
  );
}
bootstrap();
