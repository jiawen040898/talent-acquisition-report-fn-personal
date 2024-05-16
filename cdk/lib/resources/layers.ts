import { Code, type LayerVersion } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

import { BaseLayer } from '../base';

export class LayerGroupResources extends Construct {
    public readonly talentAcquisitionReportFnCommonLayer: LayerVersion;
    public readonly talentAcquisitionReportFnEmulatorLayer: LayerVersion;
    /**
     * LayerGroupResources
     *
     * @public talentAcquisitionReportFnCommonLayer {@link LayerVersion}
     * @public talentAcquisitionReportFnEmulatorLayer {@link LayerVersion}
     *
     * @param scope {@link Construct}
     * @param id
     */
    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.talentAcquisitionReportFnCommonLayer = new BaseLayer(
            scope,
            'talent-acquisition-report-fn-common-layer',
            {
                layerVersionName: 'talent-acquisition-report-fn-common-layer',
                description: 'Talent Acquisition Report Common Layer',
                code: Code.fromAsset('layer/common'),
            },
        );

        this.talentAcquisitionReportFnEmulatorLayer = new BaseLayer(
            scope,
            'talent-acquisition-report-fn-emulator-layer',
            {
                layerVersionName: 'talent-acquisition-report-fn-emulator-layer',
                description: 'Talent Acquisition Report Emulator Layer',
                code: Code.fromAsset('layer/emulator'),
            },
        );
    }
}
