import 'source-map-support/register';

import { middyfy } from 'libs/src/lambda';
import { SQSEvent, SQSRecord } from 'aws-lambda'
import formatter from "libs/src/logFormatters/sqsEvent"
import validator from 'libs/src/validators/sqsEvent';
import { insertProduct } from "../../database/product";
import isValidProduct from '../common/productValidator';
import SNS from 'libs/src/sns';

const handleSingleEvent = async (record: SQSRecord) => {
    const {title, count, img_url, price, description} = JSON.parse(record.body);
    const convertedProduct = {
        title,
        count: Number(count),
        img_url,
        price: Number(price),
        description
    };

    const { isValid, reason } = isValidProduct(convertedProduct);

    if(isValid) {
        await insertProduct(convertedProduct)
        return record;
    } else {
        throw reason;
    }
}

const lambdaEntry = async (event: SQSEvent, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const sns = new SNS(process.env.SNS_ARN);
    const { Records } = event;

    const promises = await Promise.allSettled(Records.map(record => handleSingleEvent(record)));

    promises.forEach(promise => {
        if(promise.status === 'rejected') {
            console.log(promise.reason);
        }
    })

    const successfulInserts = promises.filter(promise => promise.status === 'fulfilled').length;

    if(successfulInserts > 0) {
        await sns.publish(
            'New products have been added!',
            `${successfulInserts} new products have been added to your store`
        )
    }

    return promises;
}

export const main = middyfy(lambdaEntry, {
    eventConfiguration: {
        type: "SQSEvent",
        enablePartialBatchFailure: true
    },
    enableCors: true,
    softError: false,
    logFormatter: formatter,
    validator: validator([]),
});
