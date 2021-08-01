import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import {S3CreateEvent, S3EventRecord} from 'aws-lambda';
import S3 from "@libs/s3";
import formatter from "@libs/logFormatters/s3Event"
import { handlePerRecord } from '@libs/csv';
import validator from '@libs/validators/s3Event';

const handleSingleEvent = async (event: S3EventRecord) => {
    const { S3_BUCKET_NAME: s3BucketName, REGION: region } = process.env;
    const s3 = new S3(s3BucketName, region);

    // await CSVFromStream(await s3.getFileStream(event.s3.object.key), {
    //     logContent: true
    // });

    await handlePerRecord(
        await s3.getFileStream(event.s3.object.key),
        (row) => console.log(row)
    );
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
