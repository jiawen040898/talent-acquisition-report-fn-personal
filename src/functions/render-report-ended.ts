import { logger } from '@pulsifi/fn';
import { Handler } from 'aws-lambda';

import { RenderAssessmentReportResultData } from '../interface';
import { eventMiddleware } from '../middleware';
import { ReportGeneratorService } from '../services';

export const handleEvent: Handler<RenderAssessmentReportResultData> = async (
    event,
) => {
    logger.info('Receive render report ended request', {
        event,
    });

    const reportGeneratorService = new ReportGeneratorService();
    await reportGeneratorService.zipReportPDFAndFilesAndSendNotification(event);
};

export const handler = eventMiddleware(handleEvent);
