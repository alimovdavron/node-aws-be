export default (formatter?: (event) => string) => ({
    before: async (request) => {
        console.log(formatter ? formatter(request) : request.event)
    },
    after: async (request) => {
        console.log("RESPONSE:", request.response)
    },
    onError: async (request) => {
        console.log("ERROR:", request.error)
    },
})
