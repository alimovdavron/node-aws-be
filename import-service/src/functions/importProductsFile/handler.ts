import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import S3 from "@libs/s3";

const lambdaEntry: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  const { S3_BUCKET_NAME: s3BucketName, REGION: region } = process.env;

  const s3 = new S3(s3BucketName, region);

  const objects = await s3.listObjects('');

  return formatJSONResponse({
    objects
  });
}

export const main = middyfy(lambdaEntry, true);
