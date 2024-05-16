import {
    CompositePrincipal,
    type IRole,
    ManagedPolicy,
    ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

import { BaseIAM } from '../../base';
import { accountId } from '../../variables';
import { talentAcquisitionReportLambdaPolicy } from './talent-acquisition-report-lambda-policy';
import { talentAcquisitionReportLambdaStepFunctionPolicy } from './talent-acquisition-report-lambda-step-function-policy';

export class IAMRoleGroupResources extends Construct {
    public readonly talentAcquisitionReportLambdaRole: IRole;
    public readonly talentAcquisitionReportLambdaStepFunctionRole: IRole;

    /**
     * IAMRoleGroupResources
     *
     * @public talentAcquisitionReportLambdaRole {@link IRole}
     *
     * @param scope {@link Construct}
     * @param id
     */
    constructor(scope: Construct, id: string) {
        super(scope, id);

        const commonManagedPolicies = [
            ManagedPolicy.fromManagedPolicyArn(
                this,
                'pulsifi-kms-policy',
                `arn:aws:iam::${accountId}:policy/PulsifiKMSPolicy`,
            ),
            ManagedPolicy.fromManagedPolicyArn(
                this,
                'aws-lambda-vpc-access-execution-role',
                'arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole',
            ),
        ];

        this.talentAcquisitionReportLambdaRole = new BaseIAM(
            this,
            'talent-acquisition-report-lambda-role',
            {
                resourceName: 'talent-acquisition-report-lambda',
                assumedBy: new CompositePrincipal(
                    new ServicePrincipal('lambda.amazonaws.com'),
                ),
                customPolicies: [
                    {
                        policyName: 'talent-acquisition-report-lambda',
                        statements: talentAcquisitionReportLambdaPolicy,
                    },
                ],
                managedPolicies: [
                    ManagedPolicy.fromManagedPolicyArn(
                        this,
                        'aws-xray-write-only-access',
                        `arn:aws:iam::${accountId}:policy/PulsifiScannedDocumentBucketPolicy`,
                    ),
                    ...commonManagedPolicies,
                ],
            },
        ).role;

        this.talentAcquisitionReportLambdaStepFunctionRole = new BaseIAM(
            this,
            'talent-acquisition-report-lambda-step-function-role',
            {
                resourceName: 'talent-acquisition-report-lambda-step-function',
                assumedBy: new CompositePrincipal(
                    new ServicePrincipal('lambda.amazonaws.com'),
                    new ServicePrincipal('states.amazonaws.com'),
                ),
                customPolicies: [
                    {
                        policyName:
                            'talent-acquisition-report-lambda-step-function',
                        statements:
                            talentAcquisitionReportLambdaStepFunctionPolicy,
                    },
                ],
                managedPolicies: [...commonManagedPolicies],
            },
        ).role;
    }
}
