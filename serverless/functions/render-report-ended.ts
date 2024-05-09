/* eslint-disable @typescript-eslint/naming-convention */
import { AwsFunctionHandler } from 'serverless/aws';

import { layers, tags, version } from './variables';

export const renderReportEnded: AwsFunctionHandler = {
    name: 'talent-acquisition-render-report-ended-fn',
    description: `Trigger by step function, get all uploaded files from folder , zip and upload and send email (v${version})`,
    handler: 'src/functions/render-report-ended.handler',
    layers,
    tags,
};
