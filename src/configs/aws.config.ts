import { envUtil } from '@pulsifi/fn';

export const sqs = () => ({
    region: envUtil.get('REGION'),
    apiVersion: '2012-11-05',
    email_queue_url: envUtil.get('NOTIFICATION_EMAIL_REQUEST_QUEUE_URL'),
});

export const s3 = () => ({
    region: envUtil.get('REGION'),
    apiVersion: '2006-03-01',
    document_bucket: envUtil.get('S3_DOCUMENT_BUCKET'),
    document_download_bucket: envUtil.get('S3_DOCUMENT_DOWNLOAD_BUCKET'),
});

export const alb = () => ({
    dns: envUtil.get('AWS_ALB_DNS'),
});

export const auth0 = () => ({
    domain: envUtil.get('AUTH0_ENTERPRISE_DOMAIN'),
    audience: envUtil.get('AUTH0_ENTERPRISE_API_AUDIENCE'),
    grantType: 'client_credentials',
    secretName: envUtil.get('AUTH0_SM_NAME'),
});
