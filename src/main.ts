
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
// import { FrontendSecretGuard } from './guards/frontend-secret.guard';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', true);

  app.enableCors({
    origin: ['https://groovegg.com.br', 'http://localhost:4200', 'http://localhost:61159'],
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'X-App-Secret'],
  });


  // Se usar cookies/sessão, deixe aqui o session & passport, se necessário:
  // app.use(session({ ... }));
  // app.use(passport.initialize());
  // app.use(passport.session());

  // Injeção manual do guard global
  // app.useGlobalGuards(new FrontendSecretGuard());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
