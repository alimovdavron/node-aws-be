import 'source-map-support/register';

import { formatJSONResponse } from 'libs/src/apiGateway';
import { middyfy } from 'libs/src/lambda';
import { insertProduct } from "../../database/product";
import formatter from "libs/src/logFormatters/apiGatewayEvent";
import validator from "libs/src/validators/apiGatewayEventValidator";

const lambdaEntry = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    return formatJSONResponse(await insertProduct(event.body));
}

export const main = middyfy(lambdaEntry, {
    event: "ApiGatewayEvent",
    enableCors: true,
    logFormatter: formatter,
    validator: validator([{
            type: "body",
            parameter: "title",
            errorMessage: "title is required",
            validationFunction: (title) => typeof title === "string" && title.length > 0,
        },
        {
            type: "body",
            parameter: "price",
            errorMessage: "price must be non negative integer",
            validationFunction: (price) => typeof price === 'number' && Number.isInteger(price) && price >= 0,
        },
        {
            type: "body",
            parameter: "description",
            errorMessage: "description must be string or null",
            validationFunction: (description) => typeof description === 'string' || !description,
        },
        {
            type: "body",
            parameter: "img_url",
            errorMessage: "img_url must be string or null",
            validationFunction: (img_url) => typeof img_url === 'string' || !img_url,
        },
        {
            type: "body",
            parameter: "count",
            errorMessage: "count must be non-negative integer or null",
            validationFunction: (count) => (
                typeof count === 'number' && Number.isInteger(count) && count >= 0) ||
                (count === null || count === undefined),
        },
    ])
});
