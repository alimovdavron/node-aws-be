import middy from "@middy/core"
import middyJsonBodyParser from "@middy/http-json-body-parser"
import cors from "@middy/http-cors";
import {ProductServiceError} from "@functions/errors";

// TODO: figure out how to inject cors for errors using lib
const undefinedError = {
    statusCode: 500,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
        message: "Internal server error"
    })
}

const errorHandler = () => ({
  onError: async (request) => {
      if(request.error instanceof ProductServiceError) {
          request.response = {
              statusCode: request.error.statusCode,
              headers: {
                  'Access-Control-Allow-Origin': '*'
              },
              body: JSON.stringify({
                  message: request.error.message
              }),
          }

          return;
      }

      request.response = undefinedError;
      return;
  }
})

export const middyfy = (handler) => {
  return middy(handler)
      .use(errorHandler())
      .use(middyJsonBodyParser())
      .use(cors())
}
