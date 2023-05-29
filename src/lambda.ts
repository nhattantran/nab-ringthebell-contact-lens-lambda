import { Context, Handler, KinesisStreamEvent, KinesisStreamRecordPayload } from "aws-lambda";
import atobLib from 'atob';
import { ContactLensResponse } from "./types/ContactLens";
import { processConctactLensResponse } from "./processor/contactLensService";
import { logger } from "./utils/logger";

export const handler: Handler = async (event: KinesisStreamEvent, context: Context) => {
    logger.info('Lambda event payload:', event);
    if (!isKinesisEvent(event)) return;
    await Promise.all(event.Records.map(async (e) => await processKinesisData(e.kinesis)));
}

function isKinesisEvent(event: any): event is KinesisStreamEvent {
    return (
        Boolean(event.Records?.length) &&
        event.Records[0].hasOwnProperty('kinesis')
    );
}

async function processKinesisData(eventPayload: KinesisStreamRecordPayload) {
    try {
        const decodedData = atobLib(eventPayload.data);
        const prettyData = decodedData.replace('\\', '');
        console.log('Kinesis data:', prettyData);
        const contactLensResponse: ContactLensResponse = JSON.parse(decodedData);
        await processConctactLensResponse(contactLensResponse);
    } catch (err) {
        console.log('Process failed', err as any)
    }
}
