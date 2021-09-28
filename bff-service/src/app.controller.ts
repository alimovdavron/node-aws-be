import {
  Controller,
  All,
  Param,
  Req,
  Res,
  BadRequestException, UseInterceptors, HttpException,
} from '@nestjs/common';
import axios from 'axios';
import * as querystring from 'querystring';
import CacheProvider from "./cache.provider";
import {ServiceInterceptor} from "./service.interceptor";
import { CacheInterceptor } from "./cache.interceptor";

@Controller(['/:path/*', '/:path'])
export class AppController {
  static sendRequest = async (url, body, method) => {
    let response;

    try{
      const config:any = {
        url,
        method,
      }
      if(Object.getOwnPropertyNames(body).length > 0) {
        config.data = body
      }
      response = await axios(config);
    }
    catch (e) {
      response = e;
    }

    return response;
  };

  @All()
  @UseInterceptors(CacheInterceptor)
  async bff(@Param('path') path, @Req() req): Promise<{data: any, statusCode: number}> {
    const { data, status } = await AppController.sendRequest(
        process.env[path] + req.originalUrl,
        req.body,
        req.method
    )

    if(status >= 300) {
      throw new HttpException(data.message, status)
    }

    return data
  }
}
