import 'source-map-support/register';

import { formatJSONResponse } from 'libs/src/apiGateway';
import { middyfy } from 'libs/src/lambda';
import { SQSEvent, SQSRecord } from 'aws-lambda'
import formatter from "libs/src/logFormatters/sqsEvent"
import validator from 'libs/src/validators/sqsEvent';

const handleSingleEvent = async (event: SQSRecord) => {
    console.log(event.body)
}

const lambdaEntry = async (event: SQSEvent ) => {
    const { Records } = event;

    await Promise.all(Records.map(record => handleSingleEvent(record)));

    return formatJSONResponse({ message: "OK" });
}

export const main = middyfy(lambdaEntry, {
    event: "SQSEvent",
    enableCors: true,
    logFormatter: formatter,
    validator: validator(),
});
