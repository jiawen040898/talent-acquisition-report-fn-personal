import { logger } from '@pulsifi/fn';
import { Handler } from 'aws-lambda';

import {
    RenderAssessmentReportData,
    RenderAssessmentReportResultData,
} from '../interface';
import { eventMiddleware } from '../middleware';
import { ReportGeneratorService } from '../services';

export const handleEvent: Handler<RenderAssessmentReportData> = async (
    event,
) => {
    logger.info('Receive render report request', {
        event,
    });

    const reportGeneratorService = new ReportGeneratorService();
    const result: RenderAssessmentReportResultData =
        await reportGeneratorService.generateReportPDFAndExtractFileThenUpload(
            event,
        );

    return result;
};

export const handler = eventMiddleware(handleEvent);
