import 'source-map-support/register';

import { formatJSONResponse } from 'libs/src/apiGateway';
import { middyfy } from 'libs/src/lambda';
import {S3CreateEvent, S3EventRecord} from 'aws-lambda';
import S3 from "libs/src/s3";
import SQS from "libs/src/sqs";
import formatter from "libs/src/logFormatters/s3Event"
import { apply } from 'libs/src/csv';
import validator from 'libs/src/validators/s3Event';

const handleSingleEvent = async (event: S3EventRecord) => {
    const { S3_BUCKET_NAME: s3BucketName, REGION: region, SQS_URL } = process.env;
    const s3 = new S3(s3BucketName, region);
    const sqs = new SQS(SQS_URL);

    const key = event.s3.object.key;

    await apply(
        await s3.getFileStream(key),
        async (csvRow) => sqs.sendMessage(JSON.stringify(csvRow)),
    );

    await s3.moveFileFromFolder(key, "parsed/");
}

const lambdaEntry = async (event: S3CreateEvent ) => {
  const { Records } = event;

  await Promise.all(Records.map(record => handleSingleEvent(record)));

  return formatJSONResponse({ message: "OK" });
}

export const main = middyfy(lambdaEntry, {
    logFormatter: formatter,
    event: "S3Event",
    enableCors: true,
    validator: validator()
});
