import AWS from 'aws-sdk';

class S3 {
    private s3;
    private bucketName: string;
    constructor(bucketName: string, region: string) {
       this.bucketName = bucketName;
       this.s3 = new AWS.S3({
           region
       })
    }

    listObjects = async (prefix: string) => {
        return await this.s3.listObjectsV2({
            Bucket: this.bucketName,
            Prefix: prefix
        }).promise();
    }

    getSignedPutUrl = async (fileName: string, timeout: number = 120) => {
        return await this.s3.getSignedUrlPromise(
            'putObject',
            {
                Bucket: this.bucketName,
                Key: `uploaded/${fileName}`,
                Expires: timeout
            }
        )
    }
}

export default S3;