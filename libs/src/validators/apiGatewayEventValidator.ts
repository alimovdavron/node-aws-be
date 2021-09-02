import {ValidationError} from "../errors";
import { APIGatewayProxyEvent } from "aws-lambda";

type ParameterType = "pathParameters" | "body" | "queryStringParameters"

export type ValidationRule = {
    type: ParameterType,
    errorMessage: string,
    parameter: string,
    validationFunction: (value: any) => boolean;
}

const validateSignature = (request, type) => !request.event || !request.event[type]

export default (validationRules: ValidationRule[]) => (request: { event: APIGatewayProxyEvent }) => {
    validationRules.forEach(({type, parameter, validationFunction, errorMessage}) => {
        if (validateSignature(request, type)) {
            throw new ValidationError("incorrect event signature");
        }

        if (!validationFunction(request.event[type][parameter])) {
            throw new ValidationError(errorMessage);
        }
    })
}


export const customBodyValidator = (validationFunction: (parameter) => {isValid: boolean, reason?: string}, type: ParameterType) => (request: { event: APIGatewayProxyEvent }) => {
    if (validateSignature(request, type)) {
        throw new ValidationError("incorrect event signature");
    }

    const { isValid, reason } = validationFunction(request.event[type])

    if(!isValid) {
        throw new ValidationError(reason);
    }
}
