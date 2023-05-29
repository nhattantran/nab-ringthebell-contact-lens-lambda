import { Context, Handler, KinesisStreamEvent, KinesisStreamRecordPayload, S3CreateEvent, S3EventRecord } from "aws-lambda";
import atobLib from 'atob';
import { processS3Response } from "./processor/s3Service";

export const handler: Handler = async (event: S3CreateEvent, context: Context) => {
    console.log('Lambda event payload:', event);
    // TODO: handle records
    if (!isS3Event(event)) return;
    await Promise.all(event.Records.map(async (e) => await processS3Data(e)));
}

function isS3Event(event: any): event is KinesisStreamEvent {
    return (
        Boolean(event.Records?.length) &&
        event.Records[0].hasOwnProperty('s3')
    );
}

async function processS3Data(eventPayload: S3EventRecord) {
    try {
        console.log('S3 data:', eventPayload.s3);
        await processS3Response(eventPayload);
    } catch (err) {
        console.log('Process failed', err as any)
    }
}
