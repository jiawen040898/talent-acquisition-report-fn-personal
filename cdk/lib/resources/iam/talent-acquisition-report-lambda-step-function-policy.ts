import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';

import { accountId } from '../../variables';

const startExecutionPermissions = new PolicyStatement({
    actions: [
        'states:StartExecution',
        'states:StopExecution',
        'states:DescribeExecution',
    ],
    effect: Effect.ALLOW,
    resources: [
        `arn:aws:states:*:${accountId}:stateMachine:candidate-assessment-bulk-report`,
    ],
    sid: 'StartExecutionPermissions',
});

const eventPermissions = new PolicyStatement({
    actions: ['events:PutTargets', 'events:PutRule', 'events:DescribeRule'],
    effect: Effect.ALLOW,
    resources: [
        `arn:aws:events:*:${accountId}:rule/StepFunctionsGetEventsForStepFunctionsExecutionRule`,
    ],
    sid: 'EventPermissions',
});

const lambdaPermissions = new PolicyStatement({
    actions: ['lambda:InvokeFunction'],
    effect: Effect.ALLOW,
    resources: [
        `arn:aws:lambda:*:${accountId}:function:talent-acquisition-process-report-summary-fn:*`,
        `arn:aws:lambda:*:${accountId}:function:talent-acquisition-render-report-request-fn:*`,
        `arn:aws:lambda:*:${accountId}:function:talent-acquisition-render-report-ended-fn:*`,
    ],
    sid: 'LambdaPermissions',
});

const logPermissions = new PolicyStatement({
    actions: [
        'logs:CreateLogDelivery',
        'logs:CreateLogStream',
        'logs:GetLogDelivery',
        'logs:UpdateLogDelivery',
        'logs:DeleteLogDelivery',
        'logs:ListLogDeliveries',
        'logs:PutLogEvents',
        'logs:PutResourcePolicy',
        'logs:DescribeResourcePolicies',
        'logs:DescribeLogGroups',
    ],
    effect: Effect.ALLOW,
    resources: ['*'],
    sid: 'LogPermissions',
});

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

export const talentAcquisitionReportLambdaStepFunctionPolicy = [
    startExecutionPermissions,
    eventPermissions,
    lambdaPermissions,
    logPermissions,
    sqsPermissions,
    secretManagerPermissions,
    parameterStorePermissions,
];
