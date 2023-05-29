import { S3 } from 'aws-sdk'
import { config } from '../../config'


export const s3 = new S3({
    region: config.AWS_REGION,
    maxRetries: 2,
    sslEnabled: true,
    httpOptions: {
        connectTimeout: 2000,
    }
});
