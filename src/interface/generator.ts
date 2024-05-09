import { LaunchOptions } from 'playwright-core';

import { AssessmentReportSummary } from './assessment-report-request';

export interface ProfileData {
    profile_pdf_log_id?: number;
    data: AssessmentReportSummary;
}

export interface PDFGeneratorPayload {
    profile_data: ProfileData[]; // For now until we finalize all data that is needed
    html_template: string;
    configs: SQSConfigs;
}

export interface SQSConfigs {
    ids?: {
        user_account_id?: number;
        job_id?: number;
        pdf_task_id?: number; // Optional because the lambda can be used for other purpose
        profile_pdf_template_id?: number; // Optional because the lambda can not only used for pdf_template
    };
    bucket_path: string;
    save_path: string; // root file of the bucket to be saved. E.g. pdf-generator/xxx
    file_name?: string;
    attachments?: Attachments;
    template_options?: SafeAny;

    [key: string]: SafeAny;
}

interface Attachments {
    // this attachment object follows the blacklist methods,
    // include the files anyway if key does not exist
    // if the key is false it means don't include in the zip
    // example [key: string]: boolean | false;
    certificate: boolean | false;
    resume: boolean | false;
    transcript: boolean | false;
}

export interface LambdaResponse {
    statusCode: number;
    body: string;
    headers: SafeAny;
}

export interface Locale {
    language: string;
    timezone: string;
}

export interface TemplateOptionsPayload {
    playwrightPDFOptions?: PlaywrightPDFOptions;
    playwrightLaunchOptions?: LaunchOptions;
    localeOptions?: Locale;
}

export interface PlaywrightPDFOptions {
    displayHeaderFooter?: boolean;
    footerTemplate?: string;
    format?: string;
    headerTemplate?: string;
    height?: string | number;
    landscape?: boolean;
    margin?: {
        top?: string | number;
        right?: string | number;
        bottom?: string | number;
        left?: string | number;
    };
    pageRanges?: string;
    path?: string;
    preferCSSPageSize?: boolean;
    printBackground?: boolean;
    scale?: number;
    width?: string | number;
}

export interface FooterData {
    company_name: string;
    first_name: string;
    last_name: string;
    job_title: string;
    current_date: string;
}
