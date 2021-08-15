import middy from "@middy/core"
import middyJsonBodyParser from "@middy/http-json-body-parser"
import cors from "./corsMiddleware";
import errorHandler from "./errorHandlerMiddleware";
import validationMiddleware from "./validatorMIddleware";
import loggingMiddleware from "./loggingMiddleware";
import dotenv from 'dotenv';
import sqsPartialBatchFailure from '@middy/sqs-partial-batch-failure';

type SQSEvent = 'SQSEvent';
type S3Event = 'S3Event';
type ApiGatewayEvent = 'ApiGatewayEvent';

type S3EventConfiguration = {
    type: S3Event,
}
type ApiGatewayEventConfiguration = {
    type: ApiGatewayEvent,
}
type SQSEventConfiguration = {
    type: SQSEvent,
    enablePartialBatchFailure: boolean,
}

type EventConfiguration = S3EventConfiguration | SQSEventConfiguration | ApiGatewayEventConfiguration;

interface Options {
    enableCors?: boolean,
    eventConfiguration: EventConfiguration,
    validator: Function | null,
    logFormatter?: (event) => string;
    softError?: boolean
}

// please be informed that middleware applying order is important
export const middyfy = (handler, options: Options) => {
    const { logFormatter, validator, enableCors, eventConfiguration: { type: eventType } } = options;
    // @ts-ignore
    dotenv.config( { silent: true });

    const middified = middy(handler)

    if(options.eventConfiguration.type === 'SQSEvent') {
        if(options.eventConfiguration.enablePartialBatchFailure) {
            middified.use(sqsPartialBatchFailure())
        }
    }

    middified.use(loggingMiddleware(logFormatter));
    if(eventType === 'ApiGatewayEvent' ) {
        middified.use(middyJsonBodyParser())
    }

    if(validator) {
        middified.use(validationMiddleware(validator))
    }

    middified.use(errorHandler(options.softError));

    if(enableCors) {
        middified.use(cors())
    }

    return middified
}
