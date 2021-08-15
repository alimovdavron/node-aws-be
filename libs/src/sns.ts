import AWS from 'aws-sdk';

class SNS {
    private sns;
    private arn: string;
    constructor(arn) {
        this.arn = arn;
        this.sns = new AWS.SNS({
            region: 'eu-central-1'
        });
    }

    public publish = (title: string, message: string, attributes: any) : Promise<any> => {
        return this.sns.publish({
            Subject: title,
            Message: message,
            MessageAttributes: attributes,
            TopicArn: this.arn
        }).promise()
    }
}

export default SNS;
