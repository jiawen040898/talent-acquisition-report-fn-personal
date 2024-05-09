import { ObjectCannedACL, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { ErrorDetails, logger } from '@pulsifi/fn';
import archiver, { Archiver } from 'archiver';
import { GetObjectOutput } from 'aws-sdk/clients/s3';
import { Buffer } from 'buffer';
import { Browser } from 'playwright-core';
import { PassThrough } from 'stream';

import { ErrorCode, ErrorMessage, ErrorType } from '../../src/CustomError';
import * as AWSConfig from '../configs';
import { HTML_TEMPLATE } from '../constants/template';
import {
    AssessmentReportSummary,
    FileDownload,
    FileServiceOptions,
    FileUpload,
    ProcessedAssessmentReportSummary,
} from '../interface';
import { classify, getS3BucketAndKey } from '../utils';
import { S3Service } from './s3.service';
import { TemplateService } from './template.service';

interface ZipS3Files {
    bucket: string;
    key: string;
    folderName: string;
    fileNameWithIndex: string;
}

interface ZipS3FilesProcess {
    processedFiles: ZipS3Files[];
    filesNotFound: ZipS3Files[];
}

export class FileService {
    async generatePDF(
        browser: Browser,
        reportData: AssessmentReportSummary,
        language: string,
        timezone: string,
        options?: FileServiceOptions,
    ): Promise<FileUpload> {
        const TEMPLATE = options?.template || HTML_TEMPLATE;
        const REPORT_NAME = options?.fileName || 'Report';
        const LANGUAGE = options?.language || language;
        const TIMEZONE = options?.timezone || timezone;

        const templateOptions = {
            localeOptions: { language: LANGUAGE, timezone: TIMEZONE },
        };
        const templateService = new TemplateService(LANGUAGE, TIMEZONE);

        if (reportData.assessment_scores.role_fit?.length) {
            reportData.assessment_scores.role_fit = classify(
                reportData.assessment_scores.role_fit,
            );
        }

        const pdfBuffer = await templateService.generate(
            browser,
            TEMPLATE,
            reportData,
            templateOptions,
        );

        const fileName = (() => {
            if (!reportData.last_name) {
                return `${reportData.first_name} - ${REPORT_NAME}.pdf`;
            }
            return `${reportData.first_name} ${reportData.last_name} - ${REPORT_NAME}.pdf`;
        })();

        return {
            data: pdfBuffer,
            file_name: fileName,
        };
    }

    async downloadReportRequestFiles(
        collectedFiles: FileDownload[],
    ): Promise<FileUpload[]> {
        try {
            const storageService = new S3Service();

            const fileDownloadProcess: Promise<GetObjectOutput>[] = [];

            fileDownloadProcess.push(
                ...collectedFiles
                    .filter((file) => !!file.file_path)
                    .map((file) => {
                        const { bucket, key } = getS3BucketAndKey(
                            file.file_path!,
                        );
                        return storageService.getFileObjectOutput(bucket, key);
                    }),
            );
            const downloadedFiles: GetObjectOutput[] =
                await Promise.all(fileDownloadProcess);

            const fileData = [];
            for (const [i, file] of downloadedFiles.entries()) {
                if (!file) {
                    continue;
                }
                fileData.push({
                    file_name: collectedFiles[i].file_name,
                    extension: '.pdf',
                    data: file['Body'] as Buffer,
                });
            }

            return fileData;
        } catch (error) {
            logger.error('Failure during downloadFilesAndNameForProfile', {
                statusCode: error.statusCode,
                message: error.message,
            });

            return [];
        }
    }

    /*
    [...{ name: string, files: FileUpload[] }]
     */
    async zipAndUpload(
        processingList: ProcessedAssessmentReportSummary[],
        targetBucket: string,
        targetKey: string,
    ): Promise<string> {
        const storageService = new S3Service();
        logger.info(`${processingList.length} in zip!`);

        const passThrough = new PassThrough();

        const params = {
            Bucket: targetBucket,
            Key: targetKey, //`${uploadPath}/${uploadFileName}`,
            ContentType: 'application/zip',
            Body: passThrough,
            ACL: 'public-read',
        };
        const archive = archiver('zip', {
            zlib: {
                level: 9,
            },
        });
        logger.info(`Start Archiving`);
        archive.on('error', (err) => {
            logger.error(err.toString());
        });

        archive.on('warning', function (err) {
            if (err.code === 'ENOENT') {
                // log warning
                logger.warn(err.toString());
            } else {
                // throw error
                logger.error(err.toString());
            }
        });

        for (const [index, candidate] of processingList.entries()) {
            if (candidate?.reportPdfFile) {
                archive.append(candidate.reportPdfFile.data, {
                    name: `/${index + 1}. ${candidate.first_name} ${
                        candidate.last_name
                    }/${candidate.reportPdfFile.file_name}`,
                });
            }

            if (candidate?.reportPdfFiles) {
                candidate.reportPdfFiles.forEach((file) => {
                    archive.append(file.data, {
                        name: `/${index + 1}. ${candidate.first_name} ${
                            candidate.last_name
                        }/${file.file_name}`,
                    });
                });
            }

            if (candidate?.downloaded_files) {
                candidate.downloaded_files.forEach((file) => {
                    archive.append(file.data, {
                        name: `/${index + 1}. ${candidate.first_name} ${
                            candidate.last_name
                        }/${file.file_name}`,
                    });
                });
            }
        }

        archive.on('close', function () {
            logger.info(archive.pointer() + ' total bytes');
            logger.info(
                `archiver has been finalized and the output file descriptor has closed.`,
            );
        });

        archive.on('end', function () {
            logger.info(`Data has been drained`);
        });
        archive.pipe(passThrough);
        archive.finalize();

        logger.info(`Finalize Archiving`);

        return storageService.uploadItemInStream(params);
        // .then((result) => {
        //     logger.info('Successfully Uploaded', { result });
        //     return result.Location;
        // })
        // .catch((error) => {
        //     logger.error('Failed to Uploaded', { error });
        // });
    }

    async parallelUpload(
        processingList: ProcessedAssessmentReportSummary,
        folderPath: string,
    ) {
        const storageService = new S3Service();
        const uploadPromises: Promise<string>[] = [];

        const targetBucket = AWSConfig.s3().document_download_bucket;

        const uploadFiles = (files: FileUpload[]) => {
            for (const file of files) {
                const params = {
                    Bucket: targetBucket,
                    Key: `${folderPath}/${file.file_name}`,
                    Body: file.data,
                };
                const uploadPromise = storageService.uploadItemInStream(params);
                uploadPromises.push(uploadPromise);
            }
        };

        if (processingList?.reportPdfFiles?.length) {
            uploadFiles(processingList.reportPdfFiles);
        }

        if (processingList?.downloaded_files?.length) {
            uploadFiles(processingList.downloaded_files);
        }

        await Promise.all(uploadPromises);
    }

    async zipS3FilesProcess(
        zipS3Files: ZipS3Files[],
        storageService: S3Service,
        archive: Archiver,
    ): Promise<ZipS3FilesProcess> {
        const filesNotFound: ZipS3Files[] = [];
        const processedFiles: ZipS3Files[] = [];

        const zipS3FilesProcess = zipS3Files.map(async (file) => {
            try {
                const fileBufferString =
                    await storageService.getFileObjectInBuffer(
                        file.bucket,
                        file.key,
                    );
                archive.append(fileBufferString, {
                    name: `${file.folderName}/${file.fileNameWithIndex}`,
                });

                processedFiles.push(file);
            } catch (error) {
                if (error.Code !== 'NoSuchKey') {
                    throw error;
                }

                filesNotFound.push(file);
                logger.warn('File not found', file);
            }
        });

        await Promise.all(zipS3FilesProcess);

        return {
            processedFiles,
            filesNotFound,
        };
    }

    async zipAndUploadCandidateReportAndFiles(
        zipS3Files: ZipS3Files[],
        targetBucket: string,
        targetKey: string,
    ): Promise<string> {
        const storageService = new S3Service();
        logger.info(`${zipS3Files.length} in zip!`);

        const passThrough = new PassThrough();
        const params: PutObjectCommandInput = {
            Bucket: targetBucket,
            Key: targetKey,
            ContentType: 'application/zip',
            Body: passThrough,
            ACL: ObjectCannedACL.public_read,
        };

        const maximumSizeOfZipFile = 4e9; // 4 gb in bytes, maximum file zipped size is 4 gb
        const archive = archiver('zip', {
            zlib: {
                level: 9,
            },
            /* 
            archiver bug: stream file pause if not specify highWaterMark(threshold) for zip file, 
            the stream will pause without any reason
        */
            highWaterMark: maximumSizeOfZipFile,
            statConcurrency: 16,
        });

        logger.info(`Start Archiving`);
        archive.on('error', (err) => {
            logger.error(JSON.stringify(err));
        });

        archive.on('finish', () => {
            logger.info('archive finished...');
        });

        archive.on('warning', function (err) {
            if (err.code === 'ENOENT') {
                logger.warn(JSON.stringify(err));
            } else {
                logger.error(JSON.stringify(err));
            }
        });

        const { processedFiles, filesNotFound } = await this.zipS3FilesProcess(
            zipS3Files,
            storageService,
            archive,
        );

        archive.on('end', function () {
            logger.info(`Data has been drained`);
        });
        archive.pipe(passThrough);
        await archive.finalize();

        logger.info(`Finalize Archiving`);

        if (!processedFiles.length) {
            throw new FileNotFoundErrorException({
                error_codes: [ErrorCode.FILE_NOT_FOUND],
                filesNotFound,
            });
        }

        return await storageService.uploadItemInStream(params);
    }
}
export class FileNotFoundErrorException extends Error {
    errorDetails: ErrorDetails;

    constructor(errorDetails: ErrorDetails) {
        super(ErrorMessage.FILE_NOT_FOUND);
        this.name = ErrorType.FILE_NOT_FOUND;
        this.errorDetails = errorDetails;
    }
}
