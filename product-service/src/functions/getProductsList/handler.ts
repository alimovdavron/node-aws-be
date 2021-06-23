import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import data from '@libs/productList.json';
import {Product} from "@libs/productSchema";

const products: Product[] = data
import schema from './schema';

const getProducts = () => products;

const lambdaEntry: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  return formatJSONResponse(getProducts() ?? []);
}

export const main = middyfy(lambdaEntry);
