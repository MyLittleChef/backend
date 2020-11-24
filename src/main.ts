import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';

async function bootstrap() {
  const serverConfig = config.get('server');
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  if (process.env.NODE_ENV === 'development') {
    console.log('Enabled open CORS');
    app.enableCors({methods: 'GET,PUT,POST,DELETE,OPTIONS'});
  } else {
    console.log('Enabled production CORS');
    app.enableCors({
      //origin: 'https://www.pictalk.xyz',
      methods: 'GET,PUT,POST,DELETE,OPTIONS',
    });
  }
}
bootstrap();
