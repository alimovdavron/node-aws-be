import {ProductServiceError} from "@functions/errors";

export default () => ({
    onError: async (request) => {
        if(request.error instanceof ProductServiceError) {
            request.response = {
                statusCode: request.error.statusCode,
                body: JSON.stringify({
                    message: request.error.message
                }),
            }
        }
        else {
            request.response = {
                statusCode: 500,
                body: JSON.stringify({
                    message: "Internal server error"
                })
            };
        }
    }
})
