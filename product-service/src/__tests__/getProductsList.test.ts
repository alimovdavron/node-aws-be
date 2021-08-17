import { main as getProductsList }  from "../functions/getProductsList/handler";
import products from "../database/productList";
import productsFixture from "../fixtures/products";

jest.mock('../database/productList');
const mockedProducts = products as jest.MockedFunction<typeof products>;

describe('getProductsList', () => {
    beforeAll(() => {
        mockedProducts.mockImplementation(() => productsFixture);
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
