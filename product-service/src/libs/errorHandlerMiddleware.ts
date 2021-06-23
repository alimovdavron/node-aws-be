import {ProductServiceError} from "@functions/errors";
// TODO: figure out how to inject cors for errors using lib

const undefinedError = {
    statusCode: 500,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
        message: "Internal server error"
    })
}

export default () => ({
    onError: async (request) => {
        if(request.error instanceof ProductServiceError) {
            request.response = {
                statusCode: request.error.statusCode,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    message: request.error.message
                }),
            }

            return;
        }

        request.response = undefinedError;
        return;
    }
})
