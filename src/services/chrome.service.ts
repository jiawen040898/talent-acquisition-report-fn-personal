import { logger } from '@pulsifi/fn';
import { launchChromium, loadFont } from 'playwright-aws-lambda';
import { Browser } from 'playwright-core';
import { TemplateOptionsPayload } from 'src/interface';

import * as AWSConfig from '../configs';

export class ChromeService {
    async launchBrowser(options?: TemplateOptionsPayload): Promise<Browser> {
        const defaultLaunchOptions = {
            ignoreDefaultArgs: ['--disable-extensions'],
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--font-render-hinting=none',
                '--headless',
                '--disable-gpu',
                '--full-memory-crash-report',
                '--unlimited-storage',
                '--single-process',
            ],
        };

        const fonts =
            AWSConfig.PulsifiConfig.pulsifi_assets_pdf_custom_fonts.split(',');
        for (const fontFile of fonts) {
            const fontUrl = `${AWSConfig.PulsifiConfig.pulsifi_assets_domain}/fonts/pdf/${fontFile}`;
            await loadFont(fontUrl);
            logger.info('Custom font loaded', { fontUrl });
        }

        const launchChrome = launchChromium({
            ...defaultLaunchOptions,
            ...options?.playwrightLaunchOptions,
        });

        return launchChrome;
    }

    closeBrowser(browser: Browser) {
        return browser.close();
    }
}
