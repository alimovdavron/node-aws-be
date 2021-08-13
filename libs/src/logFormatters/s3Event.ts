import {S3CreateEvent, S3EventRecord} from "aws-lambda";

const formatRecord = (record: S3EventRecord) => {
    return `
BUCKET: ${record.s3.bucket.name}
BUCKET_ARN: ${record.s3.bucket.arn}
OBJECT_KEY: ${record.s3.object.key}
OBJECT_SIZE: ${record.s3.object.size}
    `
}

export default (request: { event: S3CreateEvent}) => {
    return request.event.Records.map(record => formatRecord(record)).join("\n")
}
