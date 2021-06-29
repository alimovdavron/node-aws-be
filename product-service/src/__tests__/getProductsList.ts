import { main as getProductsList }  from "../functions/getProductsList/handler";
import allProducts from "../database/productList.json";

describe('getProductsList', () => {
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
            body: JSON.stringify(allProducts),
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        })
    })
})
