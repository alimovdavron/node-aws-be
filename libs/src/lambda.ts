import middy from "@middy/core"
import middyJsonBodyParser from "@middy/http-json-body-parser"
import cors from "./corsMiddleware";
import errorHandler from "./errorHandlerMiddleware";
import validationMiddleware from "./validatorMIddleware";
import loggingMiddleware from "./loggingMiddleware";
import dotenv from 'dotenv';

type S3Event = "S3Event";
type ApiGatewayEvent = "ApiGatewayEvent";
type SQSEvent = 'SQSEvent';

type Events = S3Event | ApiGatewayEvent | SQSEvent;

interface Options<T extends Events> {
    enableCors?: boolean,
    event: T,
    validator: Function | null,
    logFormatter?: (event) => string;
}

// please be informed that middleware applying order is important
export const middyfy = <T extends Events>(handler, options: Options<T>) => {
    const { logFormatter, validator, enableCors } = options;
    // @ts-ignore
    dotenv.config( { silent: true });

    const middified = middy(handler)

    middified.use(loggingMiddleware(logFormatter));

    middified.use(middyJsonBodyParser())

    if(validator) {
        middified.use(validationMiddleware(validator))
    }

    middified.use(errorHandler());

    if(enableCors) {
        middified.use(cors())
    }

    return middified
}
