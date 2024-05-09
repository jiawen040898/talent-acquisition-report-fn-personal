const global = () => {
    process.env.TZ = 'UTC';
    process.env.REGION = 'ap-southeast-1';
    process.env.SERVERLESS_STAGE = 'test';
    process.env.SENTRY_DSN = 'https://test.pulsifi.me/sentry';
    process.env.AWS_SESSION_TOKEN = 'the-token';
    process.env.NOTIFICATION_EMAIL_REQUEST_QUEUE_URL =
        'https://test.pulsifi.me/queue/notitication/email';
    process.env.PULSIFI_ASSETS_DOMAIN = 'https://sandbox-assets.pulsifi.me';
    process.env.PULSIFI_ASSETS_PDF_CUSTOM_FONTS =
        'NotoSansJP-VariableFont_wght.ttf';

    process.env.PULSIFI_SUPPORTED_LOCALES =
        'en-US,pt-BR,id-ID,fr-FR,ja-JP,es-ES,th-TH,tr-TR';
    process.env.AWS_ALB_DNS = 'https://alb.test.pulsifi.me';
    process.env.AUTH0_ENTERPRISE_DOMAIN = 'auth0:xxx';
    process.env.AUTH0_ENTERPRISE_API_AUDIENCE = 'auth0:xxx';
    process.env.S3_DOCUMENT_BUCKET = 'pulsifi-sandbox-document';
    process.env.S3_DOCUMENT_DOWNLOAD_BUCKET =
        'pulsifi-sandbox-document-download';
    process.env.UNLEASH_API_KEY =
        'default:development.58a58ec16b64df5c7a2a62fc7e063fb548d2476a6cb452cff85f5d03';
    process.env.UNLEASH_API_URL =
        'https://us.app.unleash-hosted.com/usab1009/api/';
    process.env.UNLEASH_ENV = 'sandbox';
    process.env.UNLEASH_PROJECT_ID = 'default';
    process.env.AUTH0_ENTERPRISE_DOMAIN = 'auth0:xxx';
    process.env.AUTH0_ENTERPRISE_API_AUDIENCE = 'auth0:xxx';
    process.env.AUTH0_SM_NAME = 'auth-sm-name';
};

export default global;
