import type { Function as AwsLambdaFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

import { BaseFunction } from '../base';
import { version } from '../variables';
import type { IAMRoleGroupResources } from './iam/iam-roles';
import type { LayerGroupResources } from './layers';

/**
 * FunctionGroupResourcesProps
 *
 * @param iamRoleGroupResources {@link IAMRoleGroupResources}
 * @param layerGroupResources {@link LayerGroupResources}
 */
type FunctionGroupResourcesProps = {
    iamRoleGroupResources: IAMRoleGroupResources;
    layerGroupResources: LayerGroupResources;
};

export class FunctionGroupResources extends Construct {
    public readonly talentAcquisitionProcessReportSummaryFn: AwsLambdaFunction;
    public readonly talentAcquisitionRenderReportEndedFn: AwsLambdaFunction;
    public readonly talentAcquisitionRenderReportRequestFn: AwsLambdaFunction;
    /**
     * FunctionGroupResources
     *
     * @public talentAcquisitionProcessReportSummaryFn {@link AwsLambdaFunction}
     * @public talentAcquisitionRenderReportEndedFn {@link AwsLambdaFunction}
     * @public talentAcquisitionRenderReportRequestFn {@link AwsLambdaFunction}
     *
     * @param scope {@link Construct}
     * @param id
     * @param props {@link FunctionGroupResourcesProps}
     */
    constructor(
        scope: Construct,
        id: string,
        props: FunctionGroupResourcesProps,
    ) {
        super(scope, id);

        this.talentAcquisitionProcessReportSummaryFn = new BaseFunction(
            this,
            'talent-acquisition-process-report-summary-fn',
            {
                functionName: 'talent-acquisition-process-report-summary-fn',
                description: `Trigger by step function, prepare assessment summary by batch (v${version})`,
                entry: 'src/functions/process-report-summary.ts',
                isLogGroupExists: true,
                iamRole:
                    props.iamRoleGroupResources
                        .talentAcquisitionReportLambdaRole,
                layers: [
                    props.layerGroupResources
                        .talentAcquisitionReportFnCommonLayer,
                    props.layerGroupResources
                        .talentAcquisitionReportFnEmulatorLayer,
                ],
            },
        ).lambda;

        this.talentAcquisitionRenderReportEndedFn = new BaseFunction(
            this,
            'talent-acquisition-render-report-ended-fn',
            {
                functionName: 'talent-acquisition-render-report-ended-fn',
                description: `Trigger by step function, get all uploaded files from folder , zip and upload and send email (v${version})`,
                entry: 'src/functions/render-report-ended.ts',
                isLogGroupExists: true,
                iamRole:
                    props.iamRoleGroupResources
                        .talentAcquisitionReportLambdaRole,
                layers: [
                    props.layerGroupResources
                        .talentAcquisitionReportFnCommonLayer,
                    props.layerGroupResources
                        .talentAcquisitionReportFnEmulatorLayer,
                ],
            },
        ).lambda;

        this.talentAcquisitionRenderReportRequestFn = new BaseFunction(
            this,
            'talent-acquisition-render-report-request-fn',
            {
                functionName: 'talent-acquisition-render-report-request-fn',
                description: `Trigger by step function, render assessment pdf and get candidate files and upload to folder (v${version})`,
                entry: 'src/functions/render-report-request.ts',
                isLogGroupExists: true,
                iamRole:
                    props.iamRoleGroupResources
                        .talentAcquisitionReportLambdaRole,
                layers: [
                    props.layerGroupResources
                        .talentAcquisitionReportFnCommonLayer,
                    props.layerGroupResources
                        .talentAcquisitionReportFnEmulatorLayer,
                ],
            },
        ).lambda;
    }
}
