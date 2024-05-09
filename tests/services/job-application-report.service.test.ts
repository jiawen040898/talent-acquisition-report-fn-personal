import { DataSource } from 'typeorm';

import * as database from '../../src/database';
import { JobApplicationReportService } from '../../src/services';
import { getTestDataSource, getTestDataSourceAndAddData } from '../setup';
import { testData } from './fixtures/job-application-report.service.test-data';

jest.mock('../../src/services/company.service', () => {
    const mBInstance = {
        getCompanyById: jest.fn(() => testData.companyResponse),
    };
    const mB = jest.fn(() => mBInstance);
    return { CompanyService: mB };
});

jest.mock('../../src/services/psychology.service', () => {
    const mBInstance = {
        getFrameworkDetails: jest.fn(() => testData.frameworkDetailResponse),
        getFitScoreRecipeById: jest.fn(
            () => testData.getFitScoreRecipeResponse,
        ),
    };
    const mB = jest.fn(() => mBInstance);
    return { PsychologyService: mB };
});

describe('JobApplicationReportService', () => {
    let dataSource: DataSource;
    const spygetDataSource = jest.spyOn(database, 'getDataSource');

    beforeAll(async () => {
        dataSource = await getTestDataSource();

        dataSource = await getTestDataSourceAndAddData(
            testData.entitiesToBeAdded,
        );

        spygetDataSource.mockImplementation(() => {
            return Promise.resolve(dataSource);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('prepareAssessmentReportSummary', () => {
        it('should get report summary for valid job application id', async () => {
            // Act
            const result =
                await JobApplicationReportService.prepareAssessmentReportSummary(
                    testData.mockExportCandidateReportRequest,
                    dataSource,
                );

            // Assert
            expect(result).toMatchSnapshot();
        });
    });
});
