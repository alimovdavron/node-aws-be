import middy from "@middy/core"
import middyJsonBodyParser from "@middy/http-json-body-parser"
import cors from "@middy/http-cors";
import errorHandler from "@libs/errorHandlerMiddleware";

export const middyfy = (handler) => {
  return middy(handler)
      .use(errorHandler())
      .use(middyJsonBodyParser())
      .use(cors())
}
