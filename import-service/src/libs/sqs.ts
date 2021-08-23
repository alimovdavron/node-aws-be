import AWS from 'aws-sdk';

class SQS {
    private sqs;
    private queueURL: string;
    constructor(queueURL) {
        this.queueURL = queueURL;
        this.sqs = new AWS.SQS();
    }

    public sendMessage = (message: string) : Promise<any> => {
        return new Promise((resolve, reject) => {
            this.sqs.sendMessage({
                MessageBody: message,
                QueueUrl: this.queueURL
            }, (err, data) => {
                if(err) {
                    reject(err);
                } else resolve(data);
            })
        })
    }
}

export default SQS;
