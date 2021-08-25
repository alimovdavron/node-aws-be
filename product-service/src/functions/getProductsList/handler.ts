import 'source-map-support/register';

import { formatJSONResponse } from 'libs/src/apiGateway';
import { middyfy } from 'libs/src/lambda';
import { getProducts } from "../../database/product";
import formatter from "libs/src/logFormatters/apiGatewayEvent";
import validator from "libs/src/validators/apiGatewayEventValidator";

const lambdaEntry = async (_, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  return formatJSONResponse(await getProducts());
}

export const main = middyfy(lambdaEntry, {
    eventConfiguration: {
        type: 'ApiGatewayEvent'
    },
    enableCors: true,
    logFormatter: formatter,
    validator: validator([]),
});

