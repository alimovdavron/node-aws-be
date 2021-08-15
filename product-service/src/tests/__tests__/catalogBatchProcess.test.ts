import { main as catalogBatchProcess }  from "@functions/catalogBatchProcess/handler";
import { transaction } from "../../database/connection";
import { mockFunction } from '../../jestHelper/mockFunction'
import successfulTransactionMock from "../setup/postProduct/successfulTransactionMock"
import failingTransactionMock from "../setup/postProduct/failingTransactionMock"
import SNS from 'libs/src/sns';

jest.mock('libs/src/sns');
jest.mock("../../database/connection");
const transactionMock = mockFunction(transaction);

describe('catalogBatchProcess', () => {
    beforeAll(() => {
        // @ts-ignore
        SNS.mockImplementation(() => ({
            publish: () => null
        }))
    })

    test('(1) should successfully add a product', async () => {
        transactionMock.mockImplementation(successfulTransactionMock);

        const event = {
            "Records": [{
                "body": "{\"title\":\"kek\",\"price\":10}",
                "messageId": "1"
                },
                {
                    "body": "{\"title\":\"lol\"}",
                    "messageId": "2"
                }
            ]
        }

        // @ts-ignore
        const response: any = await catalogBatchProcess(event, {}, null);

        expect(response.map(product => product.status)).toStrictEqual(['fulfilled', 'fulfilled'])
    })

    test('(2) should return validation error', async () => {
        transactionMock.mockImplementation(successfulTransactionMock);

        const productToInsert = {
            description: "b",
            price: 30
        }

        const event = {
            "Records": [{
                "body": JSON.stringify(productToInsert),
                "messageId": "1"
            }]
        }

        // @ts-ignore
        await expect(catalogBatchProcess(event, {}, null)).rejects.toThrowError();
    })

    test('(3) should return validation error', async () => {
        transactionMock.mockImplementation(successfulTransactionMock);

        const productToInsert = {
            title: "a",
            price: -19
        }

        const event = {
            "Records": [{
                "body": JSON.stringify(productToInsert),
                "messageId": "1"
            }]
        }

        // @ts-ignore
        await expect(catalogBatchProcess(event, {}, null)).rejects.toThrowError();
    })

    test('(4) should return validation error', async () => {
        transactionMock.mockImplementation(successfulTransactionMock);

        const productToInsert = {
            title: "a",
            price: 9,
            description: 10,
            count: -19
        }

        const event = {
            "Records": [{
                "body": JSON.stringify(productToInsert),
                "messageId": "1"
            }]
        }

        // @ts-ignore
        await expect(catalogBatchProcess(event, {}, null)).rejects.toThrowError();
    })

    test('(5) should return internal server error', async () => {
        transactionMock.mockImplementation(failingTransactionMock);

        const productToInsert = {
            title: "a",
            price: 9,
            count: 19
        }

        const event = {
            "Records": [{
                "body": JSON.stringify(productToInsert),
                "messageId": "1"
            }]
        }

        // @ts-ignore
        await expect(catalogBatchProcess(event, {}, null)).rejects.toThrowError();
    })
})
