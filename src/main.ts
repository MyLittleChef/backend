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
  console.log('Node environment is :', process.env.NODE_ENV);
  console.log('Port is : ', port);
  console.log("Launched");
}
bootstrap();
