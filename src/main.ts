import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerBuilder } from './libs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  swaggerBuilder(app);
  await app.listen(3000);
}
bootstrap();
