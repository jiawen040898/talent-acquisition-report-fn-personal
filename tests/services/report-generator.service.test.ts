import { AppNotificationService, dateTimeUtil } from '@pulsifi/fn';

import {
    FeatureToggleService,
    FileService,
    ReportGeneratorService,
    S3Service,
} from '../../src/services';
import { testData } from './fixtures/report-generator.service.test-data';

jest.mock('../../src/services/template.service', () => {
    const mBInstance = {
        generate: jest.fn(() => 'buffer'),
    };
    const mB = jest.fn(() => mBInstance);
    return { TemplateService: mB };
});

const mockSQSClient = {
    send: jest.fn(),
};

jest.mock('@aws-sdk/client-sqs', () => {
    const actualFn = jest.requireActual('@aws-sdk/client-sqs');
    return {
        ...actualFn,
        SQSClient: jest.fn(() => mockSQSClient),
    };
});

jest.mock('../../src/services/s3.service', () => {
    const mBInstance = {
        uploadItemInStream: jest.fn(() => 'download link'),
        getFileObjectOutput: jest.fn(() => 'buffer'),
        getFileObjectInBuffer: jest.fn(() => 'buffer'),
        listS3Objects: jest.fn(() => [
            {
                Contents: [1],
                IsTruncated: true,
                NextContinuationToken: 'token',
            },
        ]),
    };
    const mB = jest.fn(() => mBInstance);
    return { S3Service: mB };
});

jest.spyOn(dateTimeUtil, 'getEpochNumber').mockImplementation(
    () => 1704873909104,
);

jest.spyOn(
    FileService.prototype,
    'zipAndUploadCandidateReportAndFiles',
).mockResolvedValue('downloadLink');

const mockedIsFeatureOn = jest.fn();
FeatureToggleService.isFeatureFlagOn = mockedIsFeatureOn;

describe('ReportGeneratorService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('generateReportPDFAndExtractFileThenUpload', () => {
        it('should generate pdf and extract files if any and upload to idempotence folder based on report summary provided', async () => {
            // Arrange
            const reportGeneratorService = new ReportGeneratorService();
            const spyParallelUpload = jest.spyOn(
                new S3Service(),
                'uploadItemInStream',
            );

            // Act
            const actual =
                await reportGeneratorService.generateReportPDFAndExtractFileThenUpload(
                    testData.mockRenderAssessmentReportData,
                );

            // Assert
            expect(actual).toMatchSnapshot();
            expect(spyParallelUpload.mock.calls).toMatchSnapshot();
        });
    });

    describe('zipReportPDFAndFilesAndSendNotification', () => {
        it('should zip files and send email with the download link', async () => {
            // Arrange
            const reportGeneratorService = new ReportGeneratorService();

            // Act
            await reportGeneratorService.zipReportPDFAndFilesAndSendNotification(
                testData.mockRenderAssessmentReportResultDataToEmail,
            );

            // Assert
            expect(mockSQSClient.send.mock.calls).toMatchSnapshot();
        });

        it('should zip files and send in app message with the download link', async () => {
            // Arrange
            const notificationSend = jest.fn();
            AppNotificationService.notifyUser = notificationSend;

            const reportGeneratorService = new ReportGeneratorService();

            // Act
            await reportGeneratorService.zipReportPDFAndFilesAndSendNotification(
                testData.mockRenderAssessmentReportResultDataToInApp,
            );

            // Assert
            expect(notificationSend.mock.calls).toMatchSnapshot();
        });
    });
});
