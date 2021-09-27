import {
  Controller,
  All,
  Param,
  Req,
  Res,
  BadRequestException, UseInterceptors,
} from '@nestjs/common';
import axios from 'axios';
import * as querystring from 'querystring';
import CacheProvider from "./cache.provider";
import {ServiceInterceptor} from "./service.interceptor";
import {CacheInterceptor} from "./cache.interceptor";

@Controller(['/:path/*', '/:path'])
@UseInterceptors(ServiceInterceptor, CacheInterceptor)
export class AppController {
  static sendRequest = async (url, body, method) => {
    const config:any = {
      url,
      method,
    }
    if(Object.getOwnPropertyNames(body).length > 0) {
      config.data = body
    }
    return axios(config);
  };

  @All()
  async bff(@Param('path') path, @Req() req, @Res() res): Promise<{data: any, statusCode: number}> {

    try {
      const { data, status } = await AppController.sendRequest(
          process.env[path] + req.originalUrl,
          req.body,
          req.method
      )

      res.status(status).send(data);
      return data
    } catch (e) {
      return e.response
    }
  }
}
