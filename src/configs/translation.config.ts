import { DEFAULT_LOCALE, envUtil } from '@pulsifi/fn';
import { TranslationConfig } from '@pulsifi/fn/services/translation';

import { TRANSLATION_NAMESPACE } from '../constants';
import { PulsifiConfig } from './pulsifi.config';

export const translationServiceConfig: TranslationConfig = {
    debug: process.env.SERVERLESS_STAGE === 'development',
    initImmediate: false,
    load: 'currentOnly',
    fallbackLng: DEFAULT_LOCALE,
    preload: (envUtil.get('PULSIFI_SUPPORTED_LOCALES') as string).split(
        ',',
    ) || [DEFAULT_LOCALE],
    ns: TRANSLATION_NAMESPACE,
    defaultNS: TRANSLATION_NAMESPACE,
    backend: {
        reloadInterval: 60 * 60 * 1000,
        crossDomain: true,
        loadPath: `${PulsifiConfig.pulsifi_assets_domain}/locales/{{ns}}/{{lng}}.json`,
    },
    parseMissingKeyHandler: () => undefined,
};
