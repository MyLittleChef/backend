import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';

async function bootstrap() {
  const serverConfig = config.get('server');
  const logger = new Logger('bootstrap');
  async function getApp() {
    try {
      const fs = require('fs')
      const keyFile = fs.readFileSync('/etc/letsencrypt/live/petit.flex.ovh/privkey.pem')
      const certFile = fs.readFileSync('/etc/letsencrypt/live/petit.flex.ovh/fullchain.pem')
      return await NestFactory.create(AppModule, {
        httpsOptions: {
          key: keyFile,
          cert: certFile,
        }
      });
    } catch {
      return await NestFactory.create(AppModule);
    }
  }
  const app = await getApp()

  const port = process.env.PORT || serverConfig.port;
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept',

  });
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100000, // limit each IP to 100 requests per windowMs
    }),
  );
  app.use(helmet());
  await app.listen(port);
  console.log('Node environment is :', process.env.NODE_ENV);
  console.log('Port is : ', port);
  console.log("Launched");
}
bootstrap();
