import { PulsifiTeam } from '@pulsifi/custom-aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import { Tags } from 'aws-cdk-lib';

import { MainStack } from '../lib/main';
import { accountId, environment, region, version } from '../lib/variables';

const app = new cdk.App();
const stackName = `talent-acquisition-report-fn-${environment}-stack`;

const stack = new MainStack(app, stackName, {
    stackName: stackName,
    env: {
        account: accountId,
        region: region,
    },
});

Tags.of(stack).add('Owner', PulsifiTeam.ENGINEERING);
Tags.of(stack).add('Environment', environment);
Tags.of(stack).add('Version', version);
