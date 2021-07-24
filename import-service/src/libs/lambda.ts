import middy from "@middy/core"
import middyJsonBodyParser from "@middy/http-json-body-parser"
import cors from "./corsMiddleware";
import errorHandler from "./errorHandlerMiddleware";
import validationMiddleware, { ValidationRule } from "./validatorMIddleware";
import loggingMiddleware from "@libs/loggingMiddleware";
import dotenv from 'dotenv';

// please be informed that middleware applying order is important
export const middyfy = (handler, enableCors: boolean, validationRules: null | ValidationRule[] = null) => {
    // @ts-ignore
    dotenv.config( { silent: true });

    const middified = middy(handler)

    middified.use(loggingMiddleware());

    middified.use(middyJsonBodyParser())

    if(validationRules) {
        middified.use(validationMiddleware(validationRules))
    }

    middified.use(errorHandler());

    if(enableCors) {
        middified.use(cors())
    }

    return middified
}
