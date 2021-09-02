const corsHeaders = {
    "Access-Control-Allow-Origin": "*"
}

const addCorsToRequest = async (request) => {
    if(request.response) {
        request.response.headers = {
            ...request.response.headers,
            ...corsHeaders
        }
    }
}

export default () => ({
    after: addCorsToRequest,
    onError: addCorsToRequest
})
