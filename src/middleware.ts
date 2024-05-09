import middy from '@middy/core';
import { initSentryMiddleware, loggerMiddleware } from '@pulsifi/fn';
import * as Sentry from '@sentry/serverless';
import { Handler } from 'aws-lambda';

import { version } from '../package.json';

initSentryMiddleware(version);

export const eventMiddleware = (handler: Handler) =>
    Sentry.AWSLambda.wrapHandler(middy(handler).use([loggerMiddleware()]));
