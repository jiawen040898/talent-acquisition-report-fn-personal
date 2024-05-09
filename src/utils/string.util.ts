import { fileUtil } from '@pulsifi/fn';
import { URL } from 'url';

import * as AWSConfig from '../configs';
import { CompanyRes } from '../interface';

/**
 * Get bucket and key from S3 URL path
 * @param urlString
 * @returns { bucket: string, key: string }
 */
export function getS3BucketAndKey(urlString: string): {
    bucket: string;
    key: string;
} {
    const url = new URL(urlString);
    const bucket = url.hostname.split('.')[0];
    const key = url.pathname.substring(1);

    return { bucket, key };
}

export function toCapitalizedWords(string: string): string {
    const words = string.match(/[A-Za-z][a-z]*/g) || [];

    return words.map(capitalize).join(' ');
}

export function getResumeFileName(
    filePath: string,
    fileNamePrefix: string,
): string {
    const fileExtension = fileUtil.getFileExtension(filePath);
    return `${fileNamePrefix} Resume.${fileExtension}`;
}

export function getAttachmentFileName(
    filePath: string,
    fileNamePrefix: string,
    fileNamePostfix: string,
): string {
    const fileExtension = fileUtil.getFileExtension(filePath);
    return `${fileNamePrefix} Attachment-${fileNamePostfix}.${fileExtension}`;
}

export function getUrlFromDocumentBucket(filePath: string): string {
    return `https://${AWSConfig.s3().document_bucket}.s3-${
        AWSConfig.s3().region
    }.amazonaws.com/${filePath}`;
}

function capitalize(string: string): string {
    return string.charAt(0).toUpperCase() + string.substring(1);
}

export function getCompanyLocale(
    company: CompanyRes,
    shouldFormatUnderScore = false,
): string {
    const DEFAULT_LOCALE = 'en-US';
    const currentLocale =
        company.locales.find((i) => i.is_default)?.locale || DEFAULT_LOCALE;
    return shouldFormatUnderScore
        ? currentLocale.replace('-', '_')
        : currentLocale;
}
