/* eslint-disable @typescript-eslint/naming-convention */
import { AwsFunctionHandler } from 'serverless/aws';

import { layers, tags, version } from './variables';

export const processReportSummary: AwsFunctionHandler = {
    name: 'talent-acquisition-process-report-summary-fn',
    description: `Trigger by step function, prepare assessment summary by batch (v${version})`,
    handler: 'src/functions/process-report-summary.handler',
    layers,
    tags,
};
