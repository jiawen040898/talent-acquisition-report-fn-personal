import {
    CompleteMultipartUploadCommandOutput,
    GetObjectCommand,
    GetObjectOutput,
    ListObjectsV2Command,
    ListObjectsV2CommandInput,
    ListObjectsV2CommandOutput,
    S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { logger } from '@pulsifi/fn';

import * as AWSConfig from '../configs';

export class S3Service {
    private readonly s3Client: S3Client;

    constructor() {
        this.s3Client = new S3Client({
            region: AWSConfig.s3().region,
            apiVersion: AWSConfig.s3().apiVersion,
        });
    }

    streamToString = (stream: SafeAny): Promise<string> =>
        new Promise((resolve, reject) => {
            const chunks: SafeAny = [];
            stream.on('data', (chunk: SafeAny) => chunks.push(chunk));
            stream.on('error', reject);
            stream.on('end', () =>
                resolve(Buffer.concat(chunks).toString('utf8')),
            );
        });

    streamToBuffer = (stream: SafeAny): Promise<Buffer> =>
        new Promise((resolve, reject) => {
            const chunks: SafeAny = [];
            stream.on('data', (chunk: SafeAny) => chunks.push(chunk));
            stream.on('error', reject);
            stream.on('end', () => resolve(Buffer.concat(chunks)));
        });

    async getFileObjectOutput(
        bucketName: string,
        key: string,
    ): Promise<GetObjectOutput> {
        try {
            const command = new GetObjectCommand({
                Bucket: bucketName,
                Key: key,
            });

            return this.s3Client.send(command);
        } catch (error) {
            return error;
        }
    }

    async getFileObjectInString(
        bucketName: string,
        key: string,
    ): Promise<string> {
        try {
            const command = new GetObjectCommand({
                Bucket: bucketName,
                Key: key,
            });

            const { Body } = await this.s3Client.send(command);
            return this.streamToString(Body);
        } catch (error) {
            return error;
        }
    }

    async getFileObjectInBuffer(
        bucketName: string,
        key: string,
    ): Promise<Buffer> {
        try {
            const command = new GetObjectCommand({
                Bucket: bucketName,
                Key: key,
            });

            const { Body } = await this.s3Client.send(command);
            return this.streamToBuffer(Body);
        } catch (error) {
            logger.error('Error retrieving file from S3:', error);
            throw error;
        }
    }

    async getSignedUrl(bucket: string, key: string): Promise<string> {
        const presignedUrlExpiresInSeconds = 3600 * 24; //24 hours
        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: key,
        });
        return getSignedUrl(this.s3Client, command, {
            expiresIn: presignedUrlExpiresInSeconds,
        });
    }

    async uploadItemInStream(params: SafeAny): Promise<string> {
        try {
            const upload = new Upload({
                client: this.s3Client,
                params,
                // queueSize: fileSizeInMb > 5 ? queueSize : undefined,
                // partSize: partSize,
            });

            return upload
                .done()
                .then((result: CompleteMultipartUploadCommandOutput) => {
                    logger.info('Successfully Uploaded', { result });
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    return result.Location!;
                })
                .catch((error) => {
                    logger.error('Failed to Uploaded', { error });
                    throw error;
                });
        } catch (error) {
            throw error;
        }
    }

    listS3Objects(
        bucketName: string,
        prefix: string,
        continuationToken?: string,
    ): Promise<ListObjectsV2CommandOutput> {
        const params: ListObjectsV2CommandInput = {
            Bucket: bucketName,
            Prefix: prefix,
            ContinuationToken: continuationToken,
        };

        try {
            const command = new ListObjectsV2Command(params);
            return this.s3Client.send(command);
        } catch (error) {
            throw error;
        }
    }

    async listFiles(bucketName: string, folderKey: string) {
        const listObjectsParams = {
            Bucket: bucketName,
            Delimiter: '/',
            Prefix: `${folderKey}/`,
        };

        const data = await this.s3Client.send(
            new ListObjectsV2Command(listObjectsParams),
        );
        return data.Contents?.map((file) => file.Key);
    }
}
