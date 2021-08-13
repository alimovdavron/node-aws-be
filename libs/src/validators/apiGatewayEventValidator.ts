import {ValidationError} from "../errors";
import { APIGatewayProxyEvent } from "aws-lambda";

export type ValidationRule = {
    type: "pathParameters" | "body" | "queryStringParameters",
    errorMessage: string,
    parameter: string,
    validationFunction: (value: any) => boolean;
}

export default (validationRules: ValidationRule[]) => (request: { event: APIGatewayProxyEvent }) => {
    validationRules.forEach(({type, parameter, validationFunction, errorMessage}) => {
        if (!request.event || !request.event[type]) {
            throw new ValidationError("incorrect event signature");
        }

        if (!validationFunction(request.event[type][parameter])) {
            throw new ValidationError(errorMessage);
        }
    })
}
