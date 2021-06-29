import {ValidationError} from "@functions/errors";

export type ValidationRule = {
    type: "pathParameters" | "body" | "queryStringParameters",
    errorMessage: string,
    parameter: string,
    validationFunction: (value: string) => boolean;
}

export default (validationRules: ValidationRule[]) => ({
    before: async (request) => {
        validationRules.forEach(({type, parameter, validationFunction, errorMessage}) => {
            if(!request.event || !request.event[type]) {
                throw new ValidationError("incorrect event signature");
            }

            if(!validationFunction(request.event[type][parameter])) {
                throw new ValidationError(errorMessage);
            }
        })
    },
})
