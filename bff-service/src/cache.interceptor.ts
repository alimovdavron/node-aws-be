import {Injectable, NestInterceptor, ExecutionContext, CallHandler} from '@nestjs/common';
import {Observable, of} from 'rxjs';
import { tap } from 'rxjs/operators';
import CacheProvider from "./cache.provider";

@Injectable()
export class CacheInterceptor implements NestInterceptor {
    constructor(private cache: CacheProvider) {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest()
        const path = req.params.path || '';
        const cacheable = req.method === 'GET' && process.env[`${path}_CACHE_ENABLED`] === 'true'

        if(cacheable) {
            const cachedValue = this.cache.getValue(req.originalUrl);
            if (cachedValue) {
                return of(cachedValue)
            }
        }

        return next.handle().pipe(tap((data) => {
            if(cacheable) {
                this.cache.setValue(req.originalUrl, data)
            }
        }))
    }
}
