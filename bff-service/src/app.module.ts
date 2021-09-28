import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import CacheProvider from "./cache.provider";
import {ServiceInterceptor} from "./service.interceptor";
import {CacheInterceptor} from "./cache.interceptor";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [CacheProvider, CacheInterceptor],
})
export class AppModule {}
