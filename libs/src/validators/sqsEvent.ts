import {ValidationError} from "product-service/functions/errors";
import { SQSEvent } from "aws-lambda";

const isJson = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

const validEventSignature = (event: SQSEvent) => {
    if(!Array.isArray(event.Records)) {
        return false;
    }

    return event.Records.map((record): boolean => {
        if(!record.body) {
            return false;
        }

        if(typeof record.body !== 'string' || !isJson(record.body)) {
            return false;
        }

        if(!record.messageId) {
            return false
        }

        return true;
    }).every((isValid) => !!isValid);
}

export default () => (request: { event: SQSEvent }) => {
    if(!validEventSignature(request.event)) {
        throw new ValidationError("incorrect event structure");
    }
}
