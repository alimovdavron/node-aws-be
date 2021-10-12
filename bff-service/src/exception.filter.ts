import {ArgumentsHost, BadGatewayException, Catch, ExceptionFilter, HttpException} from "@nestjs/common";

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): any {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        if(exception instanceof BadGatewayException) {
            return response.status(502).send('Cannot process request');
        }
        return response.status(exception.status).json(exception.response)
    }
}
