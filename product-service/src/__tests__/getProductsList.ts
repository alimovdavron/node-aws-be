import { main as getProductsList }  from "../functions/getProductsList/handler";
import allProducts from "@libs/productList.json";

describe('getProductsList', () => {
    test('should successfully return response', async () => {
        const event = {
            "headers": {
                "Content-Type": "application/json"
            },
            "body": "{}"
        }

        const response: any = await getProductsList(event, null, null);

        expect(response.statusCode).toBe(200);
        expect(response.body).toBe(JSON.stringify(allProducts));
        // expect(response.headers).toStrictEqual({
        //     'Access-Control-Allow-Origin': '*'
        // })
    })
})
