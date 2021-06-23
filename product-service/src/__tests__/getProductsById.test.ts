import { main as getProductsById }  from "../functions/getProductsById/handler";

describe('getProductsById', () => {
    test('should successfully return response', async () => {
        const event = {
            "headers": {
                "Content-Type": "application/json"
            },
            "pathParameters": {
                "productId": "46e8543c-9b42-4dec-a09b-ceb68c005b5b"
            },
            "body": "{}"
        }

        const expectedProduct = {
            "count": 6,
            "description": "11/22/63 is a novel by Stephen King about a time traveller who attempts to prevent the assassination of United States President John F. Kennedy",
            "id": "46e8543c-9b42-4dec-a09b-ceb68c005b5b",
            "price": 50,
            "title": "11/22/63",
            "img_url": "https://images-na.ssl-images-amazon.com/images/I/51vTQSkTUlL._SX329_BO1,204,203,200_.jpg"
        }

        const response: any = await getProductsById(event, null, null);

        expect(response.statusCode).toBe(200);
        expect(response.body).toBe(JSON.stringify(expectedProduct));
        // expect(response.headers).toStrictEqual({
        //     'Access-Control-Allow-Origin': '*'
        // })
    })
})
