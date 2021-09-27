import {Injectable, NestInterceptor, ExecutionContext, CallHandler, Param, BadRequestException} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ServiceInterceptor implements NestInterceptor {
    // constructor(@Param('path') private path: string) {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const path = ctx.getRequest().params.path || '';

        if (!process.env[path]) {
            throw new BadRequestException('There is no such service');
        }

        return next.handle()
    }
}