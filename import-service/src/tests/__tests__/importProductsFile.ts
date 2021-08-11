import { main as importProductsFile }  from "@functions/importProductsFile/handler";
import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';

describe('importProductsFile', () => {
    let noise: number;

    beforeAll(() => {
        AWSMock.setSDKInstance(AWS);
    })

    beforeEach(() => {
        noise = undefined;
        AWSMock.mock(
            'S3',
            'getSignedUrl',
            async (operation, params, callback) => {

                if(operation !== 'putObject') {
                    throw new Error("signed url must be created for PutObject action")
                }

                const { Key, ContentType } = params;

                if(!Key || !ContentType) {
                    throw new Error("Key and ContentType must be provided");
                }

                if(typeof Key !== 'string' || !Key.startsWith('uploaded/')) {
                    throw new Error("file must have uploaded/ prefix");
                }

                if(!Key.endsWith('.csv')) {
                    throw new Error('file must have csv format');
                }

                if(ContentType !== 'text/csv') {
                    throw new Error('content type must be text/csv');
                }

                noise = Math.floor(Math.random() * 1000);

                callback(null, Key.replace('uploaded/', '').replace(".csv", '') + noise);
        })
    })

    afterEach(() => {
        AWSMock.restore('S3');
    })

    test('should successfully return url', async () => {
        const fileName = "myfile";
        const event = {
            "headers": {
                "Content-Type": "application/json"
            },
            "queryStringParameters": {
                "name": `${fileName}.csv`
            },
            "body": "{}"
        };

        const response: any = await importProductsFile(event, null, null);

        expect(response.body).toBe(fileName + noise);
    })

    test('should return validation error', async () => {
        const event = {
            "headers": {
                "Content-Type": "application/json"
            },
            "queryStringParameters": {
                "name": ''
            },
            "body": "{}"
        };

        const response: any = await importProductsFile(event, null, null);

        expect(response.statusCode).toBe(400);
    })

    test('should return validation error', async () => {
        const event = {
            "headers": {
                "Content-Type": "application/json"
            },
            "body": "{}"
        };

        const response: any = await importProductsFile(event, null, null);

        expect(response.statusCode).toBe(400);
    })
})
