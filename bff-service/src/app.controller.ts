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
@UseInterceptors(ServiceInterceptor)
export class AppController {
  static sendRequest = async (url, headers, body, method) => {
    let response;

    delete headers.host
    delete headers.connection
    delete headers['if-none-match']

    try{
      const config:any = {
        url,
        headers,
        method,
      }
      if(Object.getOwnPropertyNames(body).length > 0) {
        config.data = body
      }
      response = await axios(config);
    }
    catch (e) {
      response = e.response;
    }

    return response;
  };

  @All()
  @UseInterceptors(CacheInterceptor)
  async bff(@Param('path') path, @Req() req): Promise<{data: any, headers: any}> {
    const { data, status, headers } = await AppController.sendRequest(
        process.env[path] + req.originalUrl,
        req.headers,
        req.body,
        req.method
    )

    for(const [key, value] of Object.entries(headers)) {
        req.res.setHeader(key, value)
    }

    req.res.status(status);

    if(status >= 400) {
      throw new HttpException(data.message, status)
    }

    return data
  }
}
