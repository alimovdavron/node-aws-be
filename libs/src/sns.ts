import AWS from 'aws-sdk';

class SNS {
    private sns;
    private arn: string;
    constructor(arn) {
        this.arn = arn;
        this.sns = new AWS.SNS();
    }

    public publish = (title: string, message: string) : Promise<any> => {
        return this.sns.sendMessage({
            Subject: title,
            Message: message,
            TopicArn: this.arn
        }).promise()
    }
}

export default SNS;
