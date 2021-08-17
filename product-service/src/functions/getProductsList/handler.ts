import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getProducts } from "../../database/product";

const lambdaEntry = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  return formatJSONResponse(await getProducts());
}

export const main = middyfy(lambdaEntry, true, null);
