import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import CacheProvider from "./cache.provider";
import {ServiceInterceptor} from "./service.interceptor";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [CacheProvider, ServiceInterceptor],
})
export class AppModule {}
