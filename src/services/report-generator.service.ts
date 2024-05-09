import { ListObjectsV2CommandOutput } from '@aws-sdk/client-s3';
import {
    AppNotificationRequest,
    AppNotificationService,
    dateTimeUtil,
    EmailActivityMessageRecipientGroup,
    EmailRequest,
    Environment,
    envUtil,
} from '@pulsifi/fn';
import { isEmpty } from 'lodash';

import * as AWSConfig from '../configs';
import {
    AppNotificationEventType,
    EmailCommunicationType,
    HTML_TEMPLATE,
    INTERVIEW_RESPONSE_HTML_TEMPLATE,
    ReportDownloadNotificationType,
} from '../constants';
import {
    AssessmentReportSummary,
    DownloadReportWebhookEventPayload,
    ExportAssessmentReportRequest,
    ExportCandidateReportRequest,
    ExportCandidateReportRequestVariable,
    ProcessedAssessmentReportSummary,
    RenderAssessmentReportData,
    RenderAssessmentReportResultData,
} from '../interface';
import { ChromeService } from './chrome.service';
import { EmailService } from './email.service';
import { FileService } from './file.service';
import { S3Service } from './s3.service';

export class ReportGeneratorService {
    private readonly fileService: FileService;
    private readonly storageService: S3Service;
    private readonly emailService: EmailService;

    constructor() {
        this.fileService = new FileService();
        this.storageService = new S3Service();
        this.emailService = new EmailService();
    }

    async generate(data: ExportAssessmentReportRequest, sourceBucket: string) {
        const targetKey = `${data.folder_upload_path}/${data.download_file_name}`;

        await this.generatePDFAndExtractDocumentThenZip(
            data,
            sourceBucket,
            targetKey,
        );

        await this.sendDownloadDocumentEmail(data, sourceBucket, targetKey);
    }

    async sendDownloadDocumentEmail(
        data: ExportAssessmentReportRequest,
        targetBucket: string,
        targetKey: string,
    ) {
        const emailRequest = data.email_request;
        if (emailRequest) {
            const downloadLink = await this.storageService.getSignedUrl(
                targetBucket,
                targetKey,
            );

            emailRequest.variables = {
                ...emailRequest.variables,
                download_link: downloadLink,
            };
            await this.emailService.sendMessage(emailRequest);
        }
    }

    async generatePDFAndExtractDocumentThenZip(
        data: ExportAssessmentReportRequest,
        targetBucket: string,
        targetKey: string,
    ) {
        // report request payload will be in array items
        const processingList = [];
        const chromeService = new ChromeService();
        const browser = await chromeService.launchBrowser();

        // loop through report request payload
        for (const reportRequestData of data.report_requests) {
            const downloadFilesPromises = [];

            const reportPdfFile = await this.fileService.generatePDF(
                browser,
                reportRequestData,
                data.locale,
                data.timezone,
            );

            // gather and download attachments files to stream
            downloadFilesPromises.push(
                this.fileService.downloadReportRequestFiles(
                    reportRequestData.files!,
                ),
            );
            const downloadedFilesProcess = await Promise.all(
                downloadFilesPromises,
            );

            // 2 files
            const downloadedFiles = downloadedFilesProcess.reduce(
                (acc, curr) => {
                    return acc.concat(curr);
                },
                [],
            );
            processingList.push({
                ...reportRequestData,
                downloaded_files: downloadedFiles,
                reportPdfFile,
            } as ProcessedAssessmentReportSummary);
        }
        // loop end

        // create zip file same level as report request folder
        await this.fileService.zipAndUpload(
            processingList,
            targetBucket,
            targetKey,
        );

        await chromeService.closeBrowser(browser);
    }

    async generateReportPDFAndExtractFileThenUpload(
        reportRequestData: RenderAssessmentReportData,
    ): Promise<RenderAssessmentReportResultData> {
        const reportSummary = reportRequestData.report_summary;
        const reportRequest = reportRequestData.report_request;
        const variable = reportRequestData.report_request.variable;

        const { folderPath, subFolderPath } = this.generateUploadFolderPath(
            reportRequest,
            variable,
            reportSummary,
        );

        const uploadFolderPath = `${folderPath}/${subFolderPath}`;

        const chromeService = new ChromeService();

        const htmlTemplates = [
            {
                template: HTML_TEMPLATE,
                fileName: 'Report',
            },
            {
                template: INTERVIEW_RESPONSE_HTML_TEMPLATE,
                fileName: 'Interview Response',
            },
        ];

        const downloadFilesPromises = [];
        const reportPdfFiles = [];

        for (const htmlTemplate of htmlTemplates) {
            const isInterviewResponseReportRequired = isEmpty(
                reportSummary.interview_rating_summary?.interview_response,
            );

            if (
                isInterviewResponseReportRequired &&
                htmlTemplate.template == INTERVIEW_RESPONSE_HTML_TEMPLATE
            ) {
                continue;
            }

            const browser = await chromeService.launchBrowser();
            const reportPdfFile = await this.fileService.generatePDF(
                browser,
                reportSummary,
                variable.locale!,
                variable.timezone!,
                htmlTemplate,
            );

            reportPdfFiles.push(reportPdfFile);
            await chromeService.closeBrowser(browser);
        }

        downloadFilesPromises.push(
            this.fileService.downloadReportRequestFiles(reportSummary.files!),
        );
        const downloadedFilesProcess = await Promise.all(downloadFilesPromises);

        // 2 files
        const downloadedFiles = downloadedFilesProcess.reduce((acc, curr) => {
            return acc.concat(curr);
        }, []);

        const processingData = {
            ...reportSummary,
            downloaded_files: downloadedFiles,
            reportPdfFiles: reportPdfFiles,
        } as ProcessedAssessmentReportSummary;

        await this.fileService.parallelUpload(processingData, uploadFolderPath);

        return {
            folderPath: folderPath,
            count: reportRequest.count,
            variable: variable,
        };
    }

    async zipReportPDFAndFilesAndSendNotification(
        eventData: RenderAssessmentReportResultData,
    ): Promise<void> {
        const targetBucket = AWSConfig.s3().document_download_bucket;

        const downloadZipFileName = `${dateTimeUtil.getEpochNumber()} ${
            eventData.count
        } Candidate.zip`;

        const uploadedReportsFilePath = await this.getAllReportsFromS3(
            eventData.folderPath,
            targetBucket,
        );

        const fileInfoArr = uploadedReportsFilePath.map((filePath) => ({
            bucket: targetBucket,
            key: filePath,
            folderName: filePath.split('/').at(-2)!,
            fileNameWithIndex: filePath.split('/').at(-1)!,
        }));

        const zipReportDownloadLink =
            await this.fileService.zipAndUploadCandidateReportAndFiles(
                fileInfoArr,
                targetBucket,
                `${eventData.folderPath}/${downloadZipFileName}`,
            );

        if (
            eventData.variable.notification_type ===
            ReportDownloadNotificationType.EMAIL
        ) {
            await this.sendEmailNotification(
                zipReportDownloadLink,
                eventData.variable,
            );
        }

        if (
            eventData.variable.notification_type ===
            ReportDownloadNotificationType.PUSHER
        ) {
            await this.sendInAppNotification(
                zipReportDownloadLink,
                eventData.variable,
            );
        }
    }

    private async getAllReportsFromS3(uploadPath: string, bucketName: string) {
        let continuationToken;
        const filesPath: string[] = [];

        do {
            const data: ListObjectsV2CommandOutput =
                await this.storageService.listS3Objects(
                    bucketName,
                    uploadPath,
                    continuationToken,
                );
            continuationToken = data.NextContinuationToken!;

            data?.Contents?.forEach((obj) => {
                const filePath = obj.Key ?? '';
                filesPath.push(filePath);
            });
        } while (continuationToken);

        return filesPath;
    }

    private generateUploadFolderPath(
        reportRequest: ExportCandidateReportRequest,
        variable: ExportCandidateReportRequestVariable,
        reportSummary: AssessmentReportSummary,
    ) {
        const basePath = 'report/assessment/';
        const folderPath = `${basePath}${variable.company_id}/${reportRequest.idempotence_key}`;
        const subFolderPath = `${reportRequest.index + 1}. ${
            reportSummary.first_name
        } ${reportSummary.last_name}`;

        return { folderPath, subFolderPath, variable };
    }

    private async sendEmailNotification(
        downloadLink: string,
        variable: ExportCandidateReportRequestVariable,
    ): Promise<void> {
        const emailService = new EmailService();

        const emailRequest: EmailRequest = {
            recipient_email: variable.user_email!,
            recipient_id: variable.user_account_id.toString(),
            recipient_group: EmailActivityMessageRecipientGroup.USER,
            email_communication_type:
                EmailCommunicationType.APPLICATION_DOCUMENT_DOWNLOAD_CONFIRMATION,
            company_id: variable.company_id,
            variables: {
                first_name: variable.user_first_name!,
                download_link: downloadLink,
            },
        };

        await emailService.sendMessage(emailRequest);
    }

    private async sendInAppNotification(
        downloadLink: string,
        variable: ExportCandidateReportRequestVariable,
    ): Promise<void> {
        const notificationRequest: AppNotificationRequest<DownloadReportWebhookEventPayload> =
            {
                event_type: AppNotificationEventType.REPORT_DOWNLOAD_READY,
                event_data: {
                    data: {
                        download_link: downloadLink,
                    },
                    meta: {
                        user_account_id: variable.user_account_id,
                        company_id: variable.company_id,
                        correlation_id: variable.correlation_id!,
                        env: envUtil.get('NODE_ENV') as Environment,
                    },
                },
            };

        return await AppNotificationService.notifyUser(
            variable.company_id,
            variable.resource_id ?? variable.user_account_id.toString(),
            notificationRequest,
        );
    }
}
