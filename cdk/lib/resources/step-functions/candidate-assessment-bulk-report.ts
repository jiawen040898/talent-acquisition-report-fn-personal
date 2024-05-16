/* eslint-disable @typescript-eslint/naming-convention */
import { Pass } from 'aws-cdk-lib/aws-stepfunctions';
import type { Construct } from 'constructs';

import { BaseStepFunction } from '../../base';
import type { FunctionGroupResources } from '../functions';

export const candidateAssessmentBulkReportDefinitionBody = (
    scope: Construct,
    functionGroupResources: FunctionGroupResources,
) => {
    /* Step Function State */
    const transformStateInput = new Pass(scope, 'TransformStateInput', {
        parameters: {
            'job_application_ids.$': '$.job_application_ids',
            'variable.$': '$.variable',
            'idempotence_key.$': 'States.UUID()',
        },
    });

    const mapReportRequest = BaseStepFunction.stepFunctionCustomState(
        scope,
        'MapReportRequest',
        {
            Type: 'Map',
            ItemProcessor: {
                ProcessorConfig: {
                    Mode: 'DISTRIBUTED',
                    ExecutionType: 'EXPRESS',
                },
                StartAt: 'ProcessReportSummary',
                States: {
                    ProcessReportSummary: {
                        Type: 'Task',
                        Resource: 'arn:aws:states:::lambda:invoke',
                        OutputPath: '$.Payload',
                        Parameters: {
                            'Payload.$': '$',
                            FunctionName: `${functionGroupResources.talentAcquisitionProcessReportSummaryFn.functionArn}:$LATEST`,
                        },
                        Retry: [
                            {
                                ErrorEquals: ['States.ALL'],
                                IntervalSeconds: 2,
                                MaxAttempts: 3,
                                BackoffRate: 2,
                            },
                        ],
                        Next: 'RenderReportSummary',
                    },
                    RenderReportSummary: {
                        Type: 'Task',
                        Resource: 'arn:aws:states:::lambda:invoke',
                        OutputPath: '$.Payload',
                        Parameters: {
                            'Payload.$': '$',
                            FunctionName: `${functionGroupResources.talentAcquisitionRenderReportRequestFn.functionArn}:$LATEST`,
                        },
                        Retry: [
                            {
                                ErrorEquals: ['States.ALL'],
                                IntervalSeconds: 2,
                                MaxAttempts: 3,
                                BackoffRate: 2,
                            },
                        ],
                        End: true,
                    },
                },
            },
            Label: 'MapReportRequest',
            ItemSelector: {
                'job_application_id.$': '$$.Map.Item.Value',
                'variable.$': '$.variable',
                'idempotence_key.$': '$.idempotence_key',
                'count.$': 'States.ArrayLength($.job_application_ids)',
                'index.$': '$$.Map.Item.Index',
            },
            MaxConcurrency: 10,
            ItemsPath: '$.job_application_ids',
            OutputPath: '$[0]',
            ToleratedFailureCount: 200,
        },
    );

    const reportReadyNotification = BaseStepFunction.stepFunctionCustomState(
        scope,
        'ReportReadyNotification',
        {
            Type: 'Task',
            Resource: 'arn:aws:states:::lambda:invoke',
            OutputPath: '$.Payload',
            Parameters: {
                FunctionName: `${functionGroupResources.talentAcquisitionRenderReportEndedFn.functionArn}:$LATEST`,
                'Payload.$': '$',
            },
            Retry: [
                {
                    ErrorEquals: ['States.ALL'],
                    IntervalSeconds: 1,
                    MaxAttempts: 3,
                    BackoffRate: 2,
                },
            ],
            End: true,
        },
    );

    const startExecution = transformStateInput
        .next(mapReportRequest)
        .next(reportReadyNotification);

    return startExecution;
};
