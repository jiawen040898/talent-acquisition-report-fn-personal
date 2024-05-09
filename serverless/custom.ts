/* eslint-disable @typescript-eslint/naming-convention */
import { Custom } from 'serverless/aws';

export const custom: Custom = {
    webpack: {
        packager: 'yarn',
        webpackConfig: './webpack.config.js',
    },
    'serverless-layers': [
        {
            common: {
                packageManager: 'yarn',
                customInstallationCommand:
                    'yarn install --pure-lockfile --prod --ignore-optional',
                layersDeploymentBucket:
                    'pulsifi-${opt:stage}-${opt:region}-layers-deployment-bucket',
                compatibleRuntimes: ['nodejs18.x'],
                retainVersions: 5,
                dependenciesPath: './package.json',
            },
        },
        {
            emulator: {
                packageManager: 'yarn',
                customInstallationCommand:
                    'yarn install --pure-lockfile --prod --ignore-optional',
                layersDeploymentBucket:
                    'pulsifi-${opt:stage}-${opt:region}-layers-deployment-bucket',
                compatibleRuntimes: ['nodejs18.x'],
                retainVersions: 5,
                dependenciesPath: './layer/emulator/package.json',
                functions: [
                    'processReportSummary',
                    'renderReportRequest',
                    'renderReportEnded',
                ],
            },
        },
    ],
    prune: {
        automatic: true,
        number: 3,
    },
    regionToLambdaExtensionLayerArn: {
        // To obtain the full list of regions layer ARN from: https://docs.aws.amazon.com/secretsmanager/latest/userguide/retrieving-secrets_lambda.html
        'ap-southeast-1':
            'arn:aws:lambda:ap-southeast-1:044395824272:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4',
        'eu-central-1':
            'arn:aws:lambda:eu-central-1:187925254637:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4',
    },
};
