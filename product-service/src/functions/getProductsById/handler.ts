import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import { getProductById } from "../../database/product";
import formatter from "@libs/logFormatters/apiGatewayEvent"
import validator from '@libs/validators/apiGatewayEventValidator';

const lambdaEntry: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { productId } = event.pathParameters;

  return formatJSONResponse(await getProductById(productId));
}

export const main = middyfy(lambdaEntry, {
  enableCors: true,
  event: "ApiGatewayEvent",
  logFormatter: formatter,
  validator: validator([{
    type: "pathParameters",
    parameter: "productId",
    errorMessage: "productId should be valid UUID of version 4",
    validationFunction: productId => /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(productId),
  }])
});
