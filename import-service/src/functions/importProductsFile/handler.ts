import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import S3 from "@libs/s3";

const lambdaEntry: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { S3_BUCKET_NAME: s3BucketName, REGION: region } = process.env;
  const { queryStringParameters: { name } } = event;

  const s3 = new S3(s3BucketName, region);

  return formatJSONResponse((await s3.getSignedPutUrl(name)).replace("eu-central-1.", ''));
}

export const main = middyfy(lambdaEntry, true, [{
  type: "queryStringParameters",
  parameter: "name",
  validationFunction: value => ((typeof value === "string") && !!value),
  errorMessage: "name must be non-empty string"
}]);
