import middy from "@middy/core"
import middyJsonBodyParser from "@middy/http-json-body-parser"
import cors from "./corsMiddleware";
import errorHandler from "./errorHandlerMiddleware";
import validationMiddleware, { ValidationRule } from "./validatorMIddleware";
import loggingMiddleware from "@libs/loggingMiddleware";

// please be informed that middleware applying order is important
export const middyfy = (handler, enableCors: boolean, validationRules: null | ValidationRule[] = null) => {
    const middified = middy(handler)

    middified.use(loggingMiddleware());

    if(validationRules) {
        middified.use(validationMiddleware(validationRules))
    }

    middified
        .use(errorHandler())
        .use(middyJsonBodyParser())

    if(enableCors) {
        middified.use(cors())
    }

    return middified
}
