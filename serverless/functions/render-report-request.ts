/* eslint-disable @typescript-eslint/naming-convention */
import { AwsFunctionHandler } from 'serverless/aws';

import { layers, tags, version } from './variables';

export const renderReportRequest: AwsFunctionHandler = {
    name: 'talent-acquisition-render-report-request-fn',
    description: `Trigger by step function, render assessment pdf and get candidate files and upload to folder (v${version})`,
    handler: 'src/functions/render-report-request.handler',
    layers,
    tags,
};
