import AWS from 'aws-sdk';

class S3 {
    private s3;
    private bucketName: string;
    constructor(bucketName: string, region: string) {
       this.bucketName = bucketName;
       this.s3 = new AWS.S3({
           region
       });
    }

    listObjects = async (prefix: string) => {
        return await this.s3.listObjectsV2({
            Bucket: this.bucketName,
            Prefix: prefix
        }).promise();
    }
}

export default S3;