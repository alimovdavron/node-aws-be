export default (validate) => ({ before: async (request) => validate(request)  })
