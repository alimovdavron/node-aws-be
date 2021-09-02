import 'source-map-support/register';

import { formatJSONResponse } from 'libs/src/apiGateway';
import { middyfy } from 'libs/src/lambda';
import { insertProduct } from "../../database/product";
import formatter from "libs/src/logFormatters/apiGatewayEvent";
import { customBodyValidator } from "libs/src/validators/apiGatewayEventValidator";
import isValidProduct from '../common/productValidator';

const lambdaEntry = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    return formatJSONResponse(await insertProduct(event.body));
}

export const main = middyfy(lambdaEntry, {
    eventConfiguration: {
        type: 'ApiGatewayEvent'
    },
    enableCors: true,
    logFormatter: formatter,
    validator: customBodyValidator(isValidProduct, "body"),
});
