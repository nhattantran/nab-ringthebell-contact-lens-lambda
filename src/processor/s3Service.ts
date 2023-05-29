import { DescribeContactRequest, GetContactAttributesRequest } from "aws-sdk/clients/connect";
import { S3Response } from "../types/S3";
import { connect } from "../functions/amazonConnect/connect";
import { DynamoDB, S3 } from "aws-sdk";
import { dynamodb } from "../functions/dynamodb/client";
import { S3EventRecord } from "aws-lambda";
import { s3 } from "../functions/s3/s3";

const instanceId: string = 'arn:aws:connect:ap-southeast-2:312734942162:instance/ba13a334-0329-4bc8-9544-a82b970effaf';
const matchedCategory: string = 'climate_change_interest'

export async function processS3Response(s3Response: S3EventRecord): Promise<void> {
    if (!s3Response.s3.object.key.endsWith('.json')) return;
    const getObjectParam: S3.GetObjectRequest = {
        Bucket: s3Response.s3.bucket.name,
        Key: s3Response.s3.object.key,
    }
    const data = await s3.getObject(getObjectParam).promise();
    const content = JSON.parse(data.Body.toString()) as S3Response;
    console.log('S3 file content:', content);
    if (!content.Categories.MatchedCategories.includes(matchedCategory)) {
        return;
    }
    const contactId: string = content.CustomerMetadata.ContactId;
    const describeContactParam: DescribeContactRequest = {
        ContactId: contactId,
        InstanceId: instanceId,
    }
    const describeContactResult = await connect.describeContact(describeContactParam).promise();
    let initContactId = contactId;
    if (describeContactResult.Contact.InitialContactId) {
        initContactId = describeContactResult.Contact.InitialContactId;
    }
    const getContactAttributeParam: GetContactAttributesRequest = {
        InitialContactId: initContactId,
        InstanceId: instanceId,
    }
    const contactAttribute = await connect.getContactAttributes(getContactAttributeParam).promise();
    console.log('Contact attributes', contactAttribute);
    if (contactAttribute.Attributes.phoneNumber) {
        try {
            const updateParam: DynamoDB.DocumentClient.UpdateItemInput = {
                TableName: 'nab-climate-change',
                Key: {
                    phoneNumber: contactAttribute.Attributes.phoneNumber,
                },
                UpdateExpression: 'SET #updatedAt = :updatedAt',
                ExpressionAttributeNames: {
                    '#updatedAt': 'updatedAt',
                },
                ExpressionAttributeValues: {
                    ':updatedAt': Date.now(),
                }
            }
            await dynamodb.update(updateParam).promise();
            console.log('Update to dynamodb successfully')
        } catch (err) {
            console.log('Error in updating dynamodb', err);
        }
    }
}
