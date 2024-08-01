import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerBuilder } from './libs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('api');
  swaggerBuilder(app);
  await app.listen(3000);
}
bootstrap();
