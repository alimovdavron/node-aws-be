import { main as importProductsFile }  from "@functions/importProductsFile/handler";
import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';

jest.mock("aws-sdk");

describe('importProductsFile', () => {
    let url: number;

    beforeAll(() => {
        AWSMock.setSDKInstance(AWS);
    })

    beforeEach(() => {
        AWSMock.mock(
            'S3',
            'getSignedUrl',
            async (operation, params) => {
                if(operation !== 'PutObject') {
                    throw new Error("signed url must be created for PutObject action")
                }

                const { Key, ContentType } = params;

                if(Key || ContentType) {
                    throw new Error("Key and ContentType must be provided");
                }

                if(typeof Key !== 'string' && Key.startsWith('uploaded/')) {
                    throw new Error("file must have uploaded/ prefix");
                }

                if(!Key.endsWith('.csv')) {
                    throw new Error('file must have csv format');
                }

                if(ContentType !== 'text/csv') {
                    throw new Error('content type must be text/csv');
                }

                url = Math.floor(Math.random() * 1000);

                return Key.replace('uploaded/', '').replace(".csv", '') + url;

                return "kek";
        })
    })

    afterEach(() => {
        AWSMock.restore('S3');
    })

    test('should return ', async () => {
        const event = {
            "headers": {
                "Content-Type": "application/json"
            },
            "queryStringParameters": {
                "name": "myfile"
            },
            "body": "{}"
        };

        const response = await importProductsFile(event, null, null);

        console.log(response);
    })

    // test('', async () => {
    //
    // })
    //
    // test('', async () => {
    //
    // })
})
