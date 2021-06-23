import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { Product } from "@libs/productSchema";
import { ValidationError } from "@functions/errors";
import data from '@libs/productList.json';
import schema from './schema';

const products: Product[] = data;

const validateInput = (productId: string) => {
  if(!/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(productId)) {
      throw new ValidationError("productId should be valid UUID of version 4");
  }
}

const getProductById: (productId: string) => undefined | Product = (productId: string) => {
    return products.find((product) => product.id === productId);
}

const lambdaEntry: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { productId } = event.pathParameters;

  validateInput(productId);

  return formatJSONResponse(getProductById(productId) ?? null);
}

export const main = middyfy(lambdaEntry);
