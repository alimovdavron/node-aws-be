import { main as postProduct }  from "@functions/postProduct/handler";
import { transaction } from "../../database/connection";
import { mockFunction } from '../../jestHelper/mockFunction'
import successfulTransactionMock, { generatedUUID } from "../setup/postProduct/successfulTransactionMock"
import failingTransactionMock from "../setup/postProduct/failingTransactionMock"

jest.mock("../../database/connection");
const transactionMock = mockFunction(transaction);

describe('getProductsList', () => {
    test('(1) should successfully add a product', async () => {
        transactionMock.mockImplementation(successfulTransactionMock);

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

        const response: any = await postProduct(event, {}, null);
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
        transactionMock.mockImplementation(successfulTransactionMock);

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

        const response: any = await postProduct(event, {}, null);
        response.body = JSON.parse(response.body)

        expect(response.statusCode).toBe(400);
    })

    test('(3) should return validation error', async () => {
        transactionMock.mockImplementation(successfulTransactionMock);

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

        const response: any = await postProduct(event, {}, null);
        response.body = JSON.parse(response.body)

        expect(response.statusCode).toBe(400);
    })

    test('(4) should return validation error', async () => {
        transactionMock.mockImplementation(successfulTransactionMock);

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

        const response: any = await postProduct(event, {}, null);
        response.body = JSON.parse(response.body)

        expect(response.statusCode).toBe(400);
    })

    test('(5) should return internal server error', async () => {
        transactionMock.mockImplementation(failingTransactionMock);

        const productToInsert = {
            title: "a",
            price: 9,
            count: 19
        }

        const event = {
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(productToInsert)
        }

        const response: any = await postProduct(event, {}, null);
        response.body = JSON.parse(response.body)

        expect(response.statusCode).toBe(500);
    })
})
