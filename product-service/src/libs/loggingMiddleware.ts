const formatRequestLog = (request) => {
    return ` 
AWS_REQUEST_ID: ${request?.context?.awsRequestId}
HEADERS: ${JSON.stringify(request?.event?.headers)}
BODY: ${JSON.stringify(JSON.parse(request?.event?.body), null, 4)}
PATH_PARAMETERS: ${JSON.stringify(request?.event?.pathParameters)}
QUERY_STRING_PARAMETERS: ${JSON.stringify(request?.event?.queryStringParameters)}
    `
}

export default () => ({
    before: async (request) => {
        console.log(formatRequestLog(request))
    },
    after: async (request) => {
        console.log("RESPONSE:", request.response)
    },
    onError: async (request) => {
        console.log("ERROR:", request.error)
    },
})
