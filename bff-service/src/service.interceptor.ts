import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    BadGatewayException
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ServiceInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const path = ctx.getRequest().params.path;

        if (!path || !process.env[path]) {
            throw new BadGatewayException('Cannot process request');
        }

        return next.handle()
    }
}
