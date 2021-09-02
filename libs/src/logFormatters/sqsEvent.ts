import {SQSEvent, SQSRecord} from "aws-lambda";

const formatRecord = (record:SQSRecord) => {
    return `
BODY: ${record.body}
EVENT_SOURCE_ARN: ${record.eventSourceARN}
MESSAGE_ID: ${record.messageId}
    `
}

export default (request: { event: SQSEvent}) => {
    return request.event.Records.map(record => formatRecord(record)).join("\n")
}
