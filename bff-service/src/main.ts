import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as path from 'path';
import * as dotenv from 'dotenv';

async function bootstrap() {
  await dotenv.config({
    path: path.resolve(__dirname, '../.env.eb'),
  });
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
