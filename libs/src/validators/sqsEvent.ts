import {ValidationError} from "../errors";
import { SQSEvent } from "aws-lambda";

export type ValidationRule = {
    errorMessage: string,
    parameter: string,
    validationFunction: (value: any) => boolean;
}

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

export default (validationRules: ValidationRule[]) => (request: { event: SQSEvent }) => {
    if(!validEventSignature(request.event)) {
        throw new ValidationError("incorrect event structure");
    }

    request.event.Records.forEach(({ body }) => {
        validationRules.forEach((rule) => {
            if(!rule.validationFunction(body)) {
                throw new ValidationError(rule.errorMessage);
            }
        })
    })
}
