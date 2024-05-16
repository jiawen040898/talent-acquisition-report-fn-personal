import type { Construct } from 'constructs';

import { CommonCDKEnvironmentVariables } from '../interfaces';
import { commonEnvironmentVariables } from './common.config';

export const config = (scope: Construct): CommonCDKEnvironmentVariables => ({
    ...commonEnvironmentVariables(scope),
});
