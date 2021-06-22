import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { Product } from "@libs/productSchema";
import data from '@libs/productList.json';
import schema from './schema';

const products: Product[] = data;

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { productId } = event.queryStringParameters;
  const product = products.find((product) => product.id === productId);
  return formatJSONResponse({
    product: product ? product : null,
  });
}

export const main = middyfy(getProductsById);
