import { main as getProductsById }  from "../functions/getProductsById/handler";
import products from "../database/productList";
import productsFixture from "../fixtures/products";

jest.mock('../database/productList');
const mockedProducts = products as jest.MockedFunction<typeof products>;

describe('getProductsById', () => {
    beforeAll(() => {
        mockedProducts.mockImplementation(() => productsFixture);
    })

    test('should successfully return response', async () => {
        const expectedProduct = productsFixture[1];

        const event = {
            "headers": {
                "Content-Type": "application/json"
            },
            "pathParameters": {
                "productId": expectedProduct.id
            },
            "body": "{}"
        }

        const response: any = await getProductsById(event, null, null);

        expect(response).toStrictEqual({
            statusCode: 200,
            body: JSON.stringify(expectedProduct),
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        })
    })

    test('should return 404 error', async () => {
        const event = {
            "headers": {
                "Content-Type": "application/json"
            },
            "pathParameters": {
                "productId": "af7f2e75-7b87-46b6-9bca-9f77ed4f1f8d"
            },
            "body": "{}"
        }

        const response: any = await getProductsById(event, null, null);

        expect(response.statusCode).toBe(404);
    })

    test('should return response with status code 400', async () => {
        const event = {
            "headers": {
                "Content-Type": "application/json"
            },
            "pathParameters": {
                "productId": "some invalid productid"
            },
            "body": "{}"
        }

        const response: any = await getProductsById(event, null, null);

        expect(response.statusCode).toBe(400);
    })
})
