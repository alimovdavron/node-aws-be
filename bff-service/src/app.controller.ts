import {
  Controller,
  All,
  Param,
  Req,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';
import * as querystring from 'querystring';
import Cache from './cache';

const cache = new Cache(120);

@Controller('/:path/*')
export class AppController {
  constructor(private readonly appService: AppService) {}

  static sendRequest = async (url, headers, body, method) => {
    return axios({
      url,
      method: method,
      data: body,
      headers,
    });
  };

  @All()
  bff(@Param('path') path: string, @Req() req, @Res() res): string {
    try {
      if (process.env[path]) {
        if (
          req.method === 'GET' &&
          process.env[`${path}_CACHE_ENABLED`] === 'true'
        ) {
          const cachedValue = cache.getValue(req.originalUrl);
          if (cachedValue) {
            return cachedValue;
          }
        }

        return 'success';
      } else {
        throw new BadRequestException('There is no such service');
      }
    } catch (e) {
      const { status, data } = e.response;

      res.status(status).send(data);
    }
  }
}
