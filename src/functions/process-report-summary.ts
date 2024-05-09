import { logger } from '@pulsifi/fn';
import { Handler } from 'aws-lambda';

import { getDataSource } from '../database';
import {
    ExportCandidateReportRequest,
    RenderAssessmentReportData,
} from '../interface';
import { eventMiddleware } from '../middleware';
import { JobApplicationReportService } from '../services';

export const handleEvent: Handler<ExportCandidateReportRequest> = async (
    reportRequest,
) => {
    logger.info('Receive generate report summary request', {
        reportRequest,
    });

    const dataSource = await getDataSource();

    const renderReportData: RenderAssessmentReportData =
        await JobApplicationReportService.prepareAssessmentReportSummary(
            reportRequest,
            dataSource,
        );

    return renderReportData;
};

export const handler = eventMiddleware(handleEvent);
