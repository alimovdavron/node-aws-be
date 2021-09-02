import {ValidationError} from "../errors";
import { S3Event } from "aws-lambda";

const isObject = value => typeof value === 'object' && value !== null

const validEventSignature = (event: S3Event) => {
    if(!Array.isArray(event.Records)) {
        return false;
    }

    return event.Records.map((record): boolean => {
        if(!isObject(record.s3)) {
            return false;
        }

        if(!isObject(record.s3.object)) {
           return false;
        }

        if(!isObject(record.s3.bucket)) {
            return false;
        }

        if(!record.s3.object.key) {
            return false;
        }

        if(record.s3.bucket.name !== process.env.S3_BUCKET_NAME) {
            return false
        }

        return true;
    }).every((isValid) => !!isValid);
}

export default () => (request: { event: S3Event }) => {
    if(!validEventSignature(request.event)) {
        throw new ValidationError("incorrect event structure");
    }
}
