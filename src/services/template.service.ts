import { logger } from '@pulsifi/fn';
import { translationService } from '@pulsifi/fn/services/translation';
import { Buffer } from 'buffer';
import { Browser } from 'playwright-core';

import { translationServiceConfig } from '../configs/translation.config';
import { I18NextError } from '../constants';
import { TRANSLATION_NAMESPACE } from '../constants/namespace';
import { FOOTER_TEMPLATE } from '../constants/template';
import { evaluate } from '../functions/page-evaluate';
import {
    AssessmentReportSummary,
    FooterData,
    PlaywrightPDFOptions,
    TemplateOptionsPayload,
} from '../interface';
import Handlebars from './handlebars.service';

/*
 * Service to compile HTML to PDF
 *
 * @returns A Buffer
 * */
export class TemplateService {
    private readonly lang;
    private readonly timezone;
    constructor(lang: string, timezone: string) {
        this.lang = lang;
        this.timezone = timezone;
    }

    async generate(
        browser: Browser,
        htmlTemplate: string,
        data: AssessmentReportSummary,
        options?: TemplateOptionsPayload,
    ): Promise<Buffer> {
        const langData = await translationService.getData(
            this.lang,
            translationServiceConfig,
        );

        if (!langData) {
            throw new Error(I18NextError.LANGUAGE_FILE_NOT_FOUND);
        }

        data = {
            ...data,
            ...langData[TRANSLATION_NAMESPACE], //To append translation key/value as handlersBar data
            ...options?.localeOptions,
        };
        // Parse template using handlebars
        const mainContent = await this._parseTemplate(htmlTemplate, data);

        const footerData: FooterData = {
            ...langData[TRANSLATION_NAMESPACE],
            first_name: data.first_name,
            last_name: data.last_name,
            company_name: data.company_name,
            job_title: data.job_title,
            current_date: new Date().toLocaleString(this.lang, {
                timeZone: this.timezone,
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
        };
        const footerContent = await this._parseTemplate(
            FOOTER_TEMPLATE,
            footerData,
        );
        // Create PDF using Playwright
        return this._createPDF(browser, mainContent, footerContent, options);
    }

    async _parseTemplate(template: string, data: object): Promise<string> {
        try {
            const compiler = Handlebars.compile(template);
            return compiler(data);
        } catch (error) {
            throw error;
        }
    }

    async _createPDF(
        browser: Browser,
        mainContent: string,
        footerContent: string,
        options?: TemplateOptionsPayload,
    ): Promise<Buffer> {
        try {
            const defaultPDFOptions: PlaywrightPDFOptions = {
                format: 'a4',
                printBackground: true,
                displayHeaderFooter: true,
                preferCSSPageSize: true,
                margin: {
                    bottom: '120px',
                    left: '72px',
                    right: '72px',
                    top: '72px',
                },
                headerTemplate: ' ',
                footerTemplate: footerContent,
            };

            const context = await browser.newContext();
            const page = await context.newPage();
            await page.setContent(mainContent, {
                waitUntil: 'domcontentloaded',
            });
            await page.evaluate(evaluate);
            await page.waitForTimeout(5000);

            const pdfBuffer = await page.pdf({
                ...defaultPDFOptions,
                ...options?.playwrightPDFOptions,
            });

            await page.close();

            return pdfBuffer;
        } catch (e) {
            // tslint:disable-next-line:no-console
            logger.error('_createPDF::Error', { e });
            throw e;
        }
    }
}
