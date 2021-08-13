import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from 'libs/src/apiGateway';
import { formatJSONResponse } from 'libs/src/apiGateway';
import { middyfy } from 'libs/src/lambda';
import schema from './schema';
import S3 from "libs/src/s3";
import formatter from "libs/src/logFormatters/apiGatewayEvent"
import validator from 'libs/src/validators/apiGatewayEventValidator';

const lambdaEntry: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { S3_BUCKET_NAME: s3BucketName, REGION: region } = process.env;
  const { queryStringParameters: { name } } = event;

  const s3 = new S3(s3BucketName, region);

  return formatJSONResponse(await s3.getSignedPutUrl(name));
}

export const main = middyfy(lambdaEntry, {
  enableCors: true,
  event: "ApiGatewayEvent",
  logFormatter: formatter,
  validator: validator([{
    type: "queryStringParameters",
    parameter: "name",
    validationFunction: value => ((typeof value === "string") && !!value),
    errorMessage: "name must be non-empty string"
  }])
})
