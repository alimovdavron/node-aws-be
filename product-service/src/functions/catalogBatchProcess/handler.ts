import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getProductById } from "../../database/product";

const lambdaEntry = async (event, context) => {
}

export const main = middyfy(lambdaEntry, true, []);
