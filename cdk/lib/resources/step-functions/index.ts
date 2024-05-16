import { DefinitionBody } from 'aws-cdk-lib/aws-stepfunctions';
import { Construct } from 'constructs';

import { BaseStepFunction } from '../../base';
import type { FunctionGroupResources } from '../functions';
import type { IAMRoleGroupResources } from '../iam/iam-roles';
import { candidateAssessmentBulkReportDefinitionBody } from './candidate-assessment-bulk-report';

/**
 * StepFunctionGroupResourcesProps
 *
 * @param iamRoleGroupResources {@link IAMRoleGroupResources}
 * @param functionGroupResources {@link FunctionGroupResources}
 */
type StepFunctionGroupResourcesProps = {
    iamRoleGroupResources: IAMRoleGroupResources;
    functionGroupResources: FunctionGroupResources;
};

export class StepFunctionGroupResources extends Construct {
    /**
     * StepFunctionGroupResources
     *
     * @param scope {@link Construct}
     * @param id
     * @param props {@link StepFunctionGroupResourcesProps}
     */
    constructor(
        scope: Construct,
        id: string,
        props: StepFunctionGroupResourcesProps,
    ) {
        super(scope, id);

        new BaseStepFunction(this, 'candidate-assessment-bulk-report', {
            stateMachineName: 'candidate-assessment-bulk-report',
            definitionBody: DefinitionBody.fromChainable(
                candidateAssessmentBulkReportDefinitionBody(
                    this,
                    props.functionGroupResources,
                ),
            ),
            role: props.iamRoleGroupResources
                .talentAcquisitionReportLambdaStepFunctionRole,
        });
    }
}
