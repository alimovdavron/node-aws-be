import { main as postProduct }  from "../functions/postProduct/handler";
import { transaction } from "../database/connection";
import { mockFunction } from '../jestHelper/mockFunction'
import { PossibleQueries } from "../database/connection";

jest.mock("../database/connection");
const transactionMock = mockFunction(transaction);
const generatedUUID = "28792047-8f3b-4538-b13a-5358db14b484";

describe('getProductsList', () => {
    beforeEach(() => {
        transactionMock.mockImplementation(async (callback) => {
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
                        if(params[0] === generatedUUID) {
                            response.count = params[1] ?? null;
                            return {
                                product_id: generatedUUID,
                                count: params[1] ?? null
                            }
                        }
                    }
                    if(query === PossibleQueries.SELECT_PRODUCT_BY_ID) {
                        if(params[0] === generatedUUID) {
                            return response
                        }
                    }

                    throw new Error("shoudn't be here")
                },
            })

            return response;
        })
    })

    test('(1) should successfully add a product', async () => {
        const productToInsert = {
            title: "a",
            description: "b",
            price: 30
        }

        const event = {
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(productToInsert)
        }

        const response: any = await postProduct(event, null, null);
        response.body = JSON.parse(response.body)

        expect(response).toStrictEqual({
            statusCode: 200,
            body: {
                id: generatedUUID,
                ...productToInsert,
                count: null,
                img_url: null
            },
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        })
    })

    test('(2) should return validation error', async () => {
        const productToInsert = {
            description: "b",
            price: 30
        }

        const event = {
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(productToInsert)
        }

        const response: any = await postProduct(event, null, null);
        response.body = JSON.parse(response.body)

        expect(response.statusCode).toBe(400);
    })

    test('(3) should return validation error', async () => {
        const productToInsert = {
            title: "a",
            price: -19
        }

        const event = {
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(productToInsert)
        }

        const response: any = await postProduct(event, null, null);
        response.body = JSON.parse(response.body)

        expect(response.statusCode).toBe(400);
    })

    test('(4) should return validation error', async () => {
        const productToInsert = {
            title: "a",
            price: 9,
            count: -19
        }

        const event = {
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(productToInsert)
        }

        const response: any = await postProduct(event, null, null);
        response.body = JSON.parse(response.body)

        expect(response.statusCode).toBe(400);
    })
})
