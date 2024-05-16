import { Fn } from 'aws-cdk-lib';
import { StringListParameter, StringParameter } from 'aws-cdk-lib/aws-ssm';
import type { Construct } from 'constructs';

import { CommonCDKEnvironmentVariables } from '../interfaces';
import { accountId, environment, region } from '../variables';

export const commonEnvironmentVariables = (
    scope: Construct,
): CommonCDKEnvironmentVariables => ({
    PUSHER_SM_NAME: 'pusher-credentials',
    SM_NAME: 'talent-acquisition-postgresql-credential',
    REDIS_SM_NAME: 'redis-credentials',
    AUTH0_SM_NAME: 'talent-acquisition-api-auth0-machine-secret',
    AWS_ALB_DNS: StringParameter.valueForStringParameter(
        scope,
        '/configs/api/AWS_ALB_BASE_DNS',
    ),
    AUTH0_ENTERPRISE_DOMAIN: StringParameter.valueForStringParameter(
        scope,
        '/configs/api/AUTH0_ENTERPRISE_DOMAIN',
    ),
    AUTH0_ENTERPRISE_API_AUDIENCE: StringParameter.valueForStringParameter(
        scope,
        '/configs/auth0/AUTH0_ENTERPRISE_API_AUDIENCE',
    ),
    NODE_ENV: environment,
    PULSIFI_ASSETS_DOMAIN: StringParameter.valueForStringParameter(
        scope,
        '/configs/PULSIFI_ASSETS_DOMAIN',
    ),
    NOTIFICATION_EMAIL_REQUEST_QUEUE_URL: `${StringParameter.valueForStringParameter(
        scope,
        '/configs/api/AWS_SQS_BASE_DNS',
    )}notification-email-request-queue`,
    S3_DOCUMENT_BUCKET: StringParameter.valueForStringParameter(
        scope,
        '/configs/S3_DOCUMENT_BUCKET',
    ),
    S3_DOCUMENT_DOWNLOAD_BUCKET: StringParameter.valueForStringParameter(
        scope,
        '/configs/S3_DOCUMENT_DOWNLOAD_BUCKET',
    ),
    SENTRY_DSN:
        'https://ab994d3b0e374c8a83ef95055069d63b@o157451.ingest.sentry.io/6531328',
    SERVERLESS_STAGE: environment,
    REGION: region,
    ACCOUNT_ID: accountId,
    PULSIFI_SUPPORTED_LOCALES: Fn.join(
        ',',
        StringListParameter.valueForTypedListParameter(
            scope,
            '/configs/PULSIFI_SUPPORTED_LOCALES',
        ),
    ),
    UNLEASH_API_KEY: StringParameter.valueForStringParameter(
        scope,
        '/configs/UNLEASH_API_KEY',
    ),
    UNLEASH_API_URL: StringParameter.valueForStringParameter(
        scope,
        '/configs/UNLEASH_API_URL',
    ),
    UNLEASH_ENV: StringParameter.valueForStringParameter(
        scope,
        '/configs/UNLEASH_ENV',
    ),
    UNLEASH_PROJECT_ID: StringParameter.valueForStringParameter(
        scope,
        '/configs/UNLEASH_PROJECT_ID',
    ),
    PULSIFI_ASSETS_PDF_CUSTOM_FONTS:
        'FiraSans-Regular.ttf,FiraSans-Medium.ttf,FiraSans-SemiBold.ttf,NotoSansJP-VariableFont_wght.ttf,NotoSansThai-VariableFont_wdth_wght.ttf',
});
