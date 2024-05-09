/* eslint-disable @typescript-eslint/naming-convention */
import { Functions } from 'serverless/aws';

import { processReportSummary } from './process-report-summary';
import { renderReportEnded } from './render-report-ended';
import { renderReportRequest } from './render-report-request';

export const functions: Functions = {
    processReportSummary,
    renderReportRequest,
    renderReportEnded,
};
