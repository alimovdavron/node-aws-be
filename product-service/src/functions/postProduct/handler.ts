import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { insertProduct } from "../../database/product";

const lambdaEntry = async (event) => {
    return formatJSONResponse(await insertProduct(event.body));
}

export const main = middyfy(lambdaEntry, true, null);
