export interface DownloadReportNotificationData {
    download_link: string;
}

export interface DownloadReportNotificationMeta {
    user_account_id: number;
    company_id: number;
    correlation_id: string;
    env: string;
}

export interface DownloadReportWebhookEventPayload {
    data: DownloadReportNotificationData;
    meta: DownloadReportNotificationMeta;
}
