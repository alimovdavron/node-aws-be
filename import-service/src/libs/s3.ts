import AWS from 'aws-sdk';

class S3 {
    private s3;
    private bucketName: string;
    constructor(bucketName: string, region: string) {
       this.bucketName = bucketName;
       this.s3 = new AWS.S3({
           region,
           signatureVersion: "v4"
       })
    }

    listObjects = async (prefix: string) => {
        return await this.s3.listObjectsV2({
            Bucket: this.bucketName,
            Prefix: prefix
        }).promise();
    }

    public copyObject = async (fileKey: string, destinationKey: string): Promise <any> => {
        return this.s3.copyObject({
            Bucket: this.bucketName,
            CopySource: this.bucketName + "/" + fileKey,
            Key: destinationKey,
        }).promise()
    }

    public removeObject = async (fileKey: string): Promise <any> => {
        return this.s3.deleteObject({
            Bucket: this.bucketName,
            Key: fileKey
        }).promise()
    }

    public moveFileFromFolder = async (fileKey: string, destinationPrefix: string) => {
        await this.copyObject(
            fileKey,
            destinationPrefix + fileKey.split('/').slice(-1)[0]);
        await this.removeObject(fileKey);
    }

    getSignedPutUrl = async (fileName: string, timeout: number = 120) => {
        return await this.s3.getSignedUrlPromise(
            'putObject',
            {
                Bucket: this.bucketName,
                Key: `uploaded/${fileName}`,
                Expires: timeout,
                ContentType: 'text/csv'
            }
        );
    }

    getFileStream = async (fileKey: string) => {
        return this.s3.getObject({
            Bucket: this.bucketName,
            Key: fileKey
        }).createReadStream()
    }
}

export default S3;
