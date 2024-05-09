import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { logger } from '@pulsifi/fn';

import * as AWSConfig from '../configs';
import { EmailRequest } from '../interface';

export class EmailService {
    private readonly sqsClient: SQSClient;
    constructor() {
        this.sqsClient = new SQSClient({
            region: AWSConfig.sqs().region,
            apiVersion: AWSConfig.sqs().apiVersion,
        });
    }

    async sendMessage(data: EmailRequest): Promise<void> {
        const params = {
            MessageBody: JSON.stringify(data),
            QueueUrl: AWSConfig.sqs().email_queue_url,
        };
        try {
            const command = new SendMessageCommand(params);
            const result = await this.sqsClient.send(command);
            logger.info('Email request message was sent', { data: result });
        } catch (error) {
            throw error;
        }
    }
}
