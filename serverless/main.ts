/* eslint-disable @typescript-eslint/naming-convention */

import { custom } from './custom';
import { functions } from './functions';
import { plugins } from './plugins';
import { stepFunctions } from './step-functions';

export const main = {
    service: 'talent-acquisition-report-fn',
    frameworkVersion: '3',
    useDotenv: true,
    configValidationMode: 'error',
    package: {
        individually: true,
    },
    provider: {
        name: 'aws',
        runtime: 'nodejs18.x',
        versionFunctions: true,
        stackName: 'talent-acquisition-report-fn-${opt:stage}-stack',
        region: '${opt:region}',
        memorySize: 1024,
        timeout: 600,
        logRetentionInDays: '${ssm:/configs/LOG_RETENTION_IN_DAYS}',
        iam: {
            role: 'arn:aws:iam::${aws:accountId}:role/talent-acquisition-report-lambda-role',
        },
        vpc: {
            securityGroupIds: [
                '${ssm:/talent-acquisition-report-fn/VPC_SECURITY_GROUP_IDS}',
            ],
            subnetIds: '${ssm:/configs/VPC_PRIVATE_SUBNET_IDS}',
        },
        stackTags: {
            Environment: '${opt:stage}',
            Owner: 'dev-team@pulsifi.me',
            Version: '${env:TAG_VERSION}',
        },
        environment: {
            PUSHER_SM_NAME: 'pusher-credentials',
            SM_NAME: 'talent-acquisition-postgresql-credential',
            REDIS_SM_NAME: 'redis-credentials',
            AUTH0_SM_NAME: 'talent-acquisition-api-auth0-machine-secret',
            AWS_ALB_DNS: '${ssm:/configs/api/AWS_ALB_BASE_DNS}',
            AUTH0_ENTERPRISE_DOMAIN:
                '${ssm:/configs/api/AUTH0_ENTERPRISE_DOMAIN}',
            AUTH0_ENTERPRISE_API_AUDIENCE:
                '${ssm:/configs/auth0/AUTH0_ENTERPRISE_API_AUDIENCE}',
            NODE_ENV: '${opt:stage}',
            PULSIFI_ASSETS_DOMAIN: '${ssm:/configs/PULSIFI_ASSETS_DOMAIN}',
            NOTIFICATION_EMAIL_REQUEST_QUEUE_URL:
                '${ssm:/configs/api/AWS_SQS_BASE_DNS}notification-email-request-queue',
            S3_DOCUMENT_BUCKET: '${ssm:/configs/S3_DOCUMENT_BUCKET}',
            S3_DOCUMENT_DOWNLOAD_BUCKET:
                '${ssm:/configs/S3_DOCUMENT_DOWNLOAD_BUCKET}',
            SENTRY_DSN:
                'https://abc67274ac004e49a7486bb11cf19ed7@o157451.ingest.sentry.io/6080205',
            SERVERLESS_STAGE: '${opt:stage}',
            REGION: '${aws:region}',
            ACCOUNT_ID: '${aws:accountId}',
            PULSIFI_SUPPORTED_LOCALES:
                '${ssm(raw):/configs/PULSIFI_SUPPORTED_LOCALES}',
            UNLEASH_API_KEY: '${ssm:/configs/UNLEASH_API_KEY}',
            UNLEASH_API_URL: '${ssm:/configs/UNLEASH_API_URL}',
            UNLEASH_ENV: '${ssm:/configs/UNLEASH_ENV}',
            UNLEASH_PROJECT_ID: '${ssm:/configs/UNLEASH_PROJECT_ID}',
            PULSIFI_ASSETS_PDF_CUSTOM_FONTS:
                'FiraSans-Regular.ttf,FiraSans-Medium.ttf,FiraSans-SemiBold.ttf,NotoSansJP-VariableFont_wght.ttf,NotoSansThai-VariableFont_wdth_wght.ttf',
        },
        deploymentBucket: {
            blockPublicAccess: true,
            name: 'talentacquisitionrpt-${opt:stage}-${opt:region}-stack-bucket-1',
            maxPreviousDeploymentArtifacts: 5,
            serverSideEncryption: 'AES256',
        },
    },
    resources: {
        extensions: {
            ProcessReportSummaryLogGroup: {
                DeletionPolicy: 'Retain',
            },
            RenderReportRequestLogGroup: {
                DeletionPolicy: 'Retain',
            },
            RenderReportEndedLogGroup: {
                DeletionPolicy: 'Retain',
            },
        },
    },
    plugins,
    custom,
    functions,
    stepFunctions,
};

export default main;
