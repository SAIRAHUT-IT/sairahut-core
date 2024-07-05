import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';
import { NODE_ENV } from 'src/config/variables';

function swaggerBuilder(app: INestApplication) {
  if (NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('SAIRAHUT CORE')
      .setDescription('SAIRAHUT CORE API Documentation')
      .setVersion('0.2')
      .addBasicAuth()
      .build();
    const document = SwaggerModule.createDocument(
      app,
      config,
    );
    SwaggerModule.setup('docsapi', app, document);
  }
}

export { swaggerBuilder };
