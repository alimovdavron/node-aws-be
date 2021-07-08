import { main as getProductsList }  from "@functions/getProductsList/handler";
import { requestArray } from "../../database/connection";
import { mockFunction } from '../../jestHelper/mockFunction'
import productsFixture from "../../fixtures/products";
import { PossibleQueries } from "../../database/connection";

jest.mock("../../database/connection");
const requestArrayMock = mockFunction(requestArray);

describe('getProductsList', () => {
    beforeAll(() => {
        requestArrayMock.mockImplementation(async (query) => {
            if(query === PossibleQueries.SELECT_ALL_PRODUCTS) {
                return productsFixture;
            }
        })
    })

    test('should successfully return response', async () => {
        const event = {
            "headers": {
                "Content-Type": "application/json"
            },
            "body": "{}"
        }

        const response: any = await getProductsList(event, null, null);

        expect(response).toStrictEqual({
            statusCode: 200,
            body: JSON.stringify(productsFixture),
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        })
    })
})
