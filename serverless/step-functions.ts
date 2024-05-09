/* eslint-disable @typescript-eslint/naming-convention */
import { StepFunction } from './interfaces/step-function.interface';

export const stepFunctions: StepFunction = {
    stateMachines: {
        candidateAssessmentBulkReport: {
            name: 'candidateAssessmentBulkReport',
            definition: {
                StartAt: 'TransformStateInput',
                States: {
                    TransformStateInput: {
                        Type: 'Pass',
                        Next: 'MapReportRequest',
                        Parameters: {
                            'job_application_ids.$': '$.job_application_ids',
                            'variable.$': '$.variable',
                            'idempotence_key.$': 'States.UUID()',
                        },
                    },
                    MapReportRequest: {
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
                                        FunctionName:
                                            'arn:aws:lambda:${aws:region}:${aws:accountId}:function:talent-acquisition-process-report-summary-fn:$LATEST',
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
                                        FunctionName:
                                            'arn:aws:lambda:${aws:region}:${aws:accountId}:function:talent-acquisition-render-report-request-fn:$LATEST',
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
                            'count.$':
                                'States.ArrayLength($.job_application_ids)',
                            'index.$': '$$.Map.Item.Index',
                        },
                        MaxConcurrency: 10,
                        ItemsPath: '$.job_application_ids',
                        Next: 'ReportReadyNotification',
                        OutputPath: '$[0]',
                        ToleratedFailureCount: 200,
                    },
                    ReportReadyNotification: {
                        Type: 'Task',
                        Resource: 'arn:aws:states:::lambda:invoke',
                        OutputPath: '$.Payload',
                        Parameters: {
                            FunctionName:
                                'arn:aws:lambda:${aws:region}:${aws:accountId}:function:talent-acquisition-render-report-ended-fn:$LATEST',
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
                },
            },
            role: 'arn:aws:iam::${aws:accountId}:role/TalentAcquisitionReportLambda',
        },
    },
};
