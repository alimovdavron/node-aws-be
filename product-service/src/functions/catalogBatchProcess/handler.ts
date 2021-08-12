import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { SQSEvent, SQSRecord } from 'aws-lambda'

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

});
