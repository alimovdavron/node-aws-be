const addCorsToRequest = async (request) => {
    if(request.response) {
        request.response.headers = {
            ...request.response.headers,
            "Access-Control-Allow-Origin": "*"
        }
    }
}

export default () => ({
    after: addCorsToRequest,
    onError: addCorsToRequest
})
