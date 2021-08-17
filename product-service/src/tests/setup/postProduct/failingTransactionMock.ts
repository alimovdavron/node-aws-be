import {PossibleQueries} from "../../../database/connection";

export const generatedUUID = "28792047-8f3b-4538-b13a-5358db14b484";

export default async (callback) => {
    let response = null;
    await callback({
        requestArray: async <T>(): Promise<T[]> => {
            throw new Error("shouldn't be here")
        },
        // @ts-ignore
        requestSingle: async (query, params) => {
            if(query === PossibleQueries.INSERT_PRODUCT) {
                response = {
                    id : generatedUUID,
                    description : params[1] ?? null,
                    price : params[2] ?? null,
                    title : params[0] ?? null,
                    img_url : params[4] ?? null
                }

                return response;
            }
            if(query === PossibleQueries.INSERT_STOCK) {
                throw new Error("test error")
            }
            if(query === PossibleQueries.SELECT_PRODUCT_BY_ID) {
                if(params[0] === generatedUUID) {
                    return response
                }
            }

            throw new Error("shouldn't be here")
        },
    })

    return response;
}
