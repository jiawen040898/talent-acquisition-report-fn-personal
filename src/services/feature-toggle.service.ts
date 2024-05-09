import { ErrorDetails } from '@pulsifi/fn';
import { startUnleash, Unleash } from 'unleash-client';

import { UnleashConfig } from '../configs';
import {
    FeatureToggleName,
    UnleashErrorCode,
    UnleashErrorMessage,
    UnleashErrorType,
} from '../constants';

let unleash: Unleash | null = null;

const initUnleash = () => {
    const config = UnleashConfig();
    const url = config.apiUrl;
    const projectId = config.projectId;
    const authToken = config.apiKey;

    return startUnleash({
        url: url,
        appName: projectId,
        customHeaders: { Authorization: authToken },
    });
};

const isFeatureOn = async (
    flag: SafeAny,
    unleashContext: { [key: string]: string },
): Promise<boolean> => {
    try {
        if (!unleash) {
            unleash = await initUnleash();
        }

        return unleash.isEnabled(flag, unleashContext);
    } catch (error) {
        throw new FailedToGetUnleashEnabledFlag({
            error_codes: [UnleashErrorCode.FAILED_TO_GET_UNLEASH_ENABLED_FLAG],
            error,
        });
    }
};

export class FailedToGetUnleashEnabledFlag extends Error {
    errorDetails: ErrorDetails;

    constructor(errorDetails: ErrorDetails) {
        super(UnleashErrorMessage.FAILED_TO_GET_UNLEASH_ENABLED_FLAG);
        this.name = UnleashErrorType.FAILED_TO_GET_UNLEASH_ENABLED_FLAG;
        this.errorDetails = errorDetails;
    }
}

const isFeatureFlagOn = async (
    companyId: number,
    flag: FeatureToggleName,
): Promise<boolean> => {
    if (!companyId) {
        return false;
    }

    const unleashContext: { [key: string]: string } = {
        environment: UnleashConfig().environment,
        companyId: companyId.toString(),
    };

    return FeatureToggleService.isFeatureOn(flag, unleashContext);
};

export const FeatureToggleService = {
    isFeatureOn,
    isFeatureFlagOn,
};
