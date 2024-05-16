import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

import { accountId } from '../../variables';

const sqsPermissions = new PolicyStatement({
    actions: [
        'sqs:DeleteMessage',
        'sqs:GetQueueUrl',
        'sqs:SendMessage',
        'sqs:GetQueueAttributes',
    ],
    effect: Effect.ALLOW,
    resources: [`arn:aws:sqs:*:${accountId}:notification-email-request-queue`],
    sid: 'SQSPermissions',
});

const parameterStorePermissions = new PolicyStatement({
    actions: [
        'ssm:GetParameter',
        'ssm:GetParameters',
        'ssm:GetParametersByPath',
    ],
    effect: Effect.ALLOW,
    resources: [
        `arn:aws:ssm:*:${accountId}:parameter/talent-acquisition-report-fn/*`,
        `arn:aws:ssm:*:${accountId}:parameter/configs/*`,
    ],
    sid: 'ParameterStorePermissions',
});

const secretManagerPermissions = new PolicyStatement({
    actions: ['secretsmanager:DescribeSecret', 'secretsmanager:GetSecretValue'],
    effect: Effect.ALLOW,
    resources: [
        `arn:aws:secretsmanager:*:${accountId}:secret:talent-acquisition-postgresql-credential-*`,
        `arn:aws:secretsmanager:*:${accountId}:secret:redis-credentials-*`,
        `arn:aws:secretsmanager:*:${accountId}:secret:talent-acquisition-api-auth0-machine-secret-*`,
        `arn:aws:secretsmanager:*:${accountId}:secret:pusher-credentials*`,
    ],
    sid: 'SecretManagerPermissions',
});

const S3Permissions = (scope: Construct) =>
    new PolicyStatement({
        actions: [
            's3:PutObject',
            's3:GetObjectAcl',
            's3:GetObject',
            's3:PutObjectAcl',
        ],
        effect: Effect.ALLOW,
        resources: [
            `arn:aws:s3:::${StringParameter.valueForStringParameter(
                scope,
                '/configs/S3_DOCUMENT_BUCKET',
            )}/candidates/*`,
            `arn:aws:s3:::${StringParameter.valueForStringParameter(
                scope,
                '/configs/S3_DOCUMENT_DOWNLOAD_BUCKET',
            )}/report/*`,
        ],
        sid: 'S3Permissions',
    });

const S3ListPermissions = (scope: Construct) =>
    new PolicyStatement({
        actions: ['s3:ListBucket'],
        effect: Effect.ALLOW,
        resources: [
            `arn:aws:s3:::${StringParameter.valueForStringParameter(
                scope,
                '/configs/S3_DOCUMENT_BUCKET',
            )}`,
            `arn:aws:s3:::${StringParameter.valueForStringParameter(
                scope,
                '/configs/S3_DOCUMENT_DOWNLOAD_BUCKET',
            )}`,
        ],
        sid: 'S3ListPermissions',
    });

export const talentAcquisitionReportLambdaPolicy = [
    sqsPermissions,
    secretManagerPermissions,
    parameterStorePermissions,
    S3Permissions,
    S3ListPermissions,
];
