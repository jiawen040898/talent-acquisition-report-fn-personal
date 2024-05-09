import { translationService } from '@pulsifi/fn/services/translation';

import { ExportAssessmentReportRequest } from '../../src/interface';
import {
    ChromeService,
    FeatureToggleService,
    FileService,
    TemplateService,
} from '../../src/services';
import { testData } from '../services/fixtures/translation.service.test-data';
import { HtmlTemplates, OneCandidateWithFullDetails } from './fixtures/data';
// import * as fs from 'fs'; //Comment out when testing locally

jest.setTimeout(15000);
const mockedi18next = jest.fn();
translationService.getData = mockedi18next;
mockedi18next.mockResolvedValue(testData.englishTranslation);

const mockedIsFeatureOn = jest.fn();
FeatureToggleService.isFeatureFlagOn = mockedIsFeatureOn;

describe('generateAssessmentReport', () => {
    it.each(HtmlTemplates)(
        'should pass generate assessment and interview response report',
        async (htmlTemplate) => {
            // Arrange
            mockedIsFeatureOn.mockClear();

            const mockData =
                OneCandidateWithFullDetails as unknown as ExportAssessmentReportRequest;

            const data = {
                ...testData.englishTranslation,
                ...mockData.report_requests[0],
            };

            const fileService = new FileService();
            const chromeService = new ChromeService();

            const browser = await chromeService.launchBrowser();

            // Act
            const reportPdfFile = await fileService.generatePDF(
                browser,
                data,
                'en-US',
                'Asia/Kuala_Lumpur',
                htmlTemplate,
            );

            // Assert
            expect(reportPdfFile.data).toEqual(expect.any(Buffer));

            // Comment out when testing locally
            // await fs.writeFile(
            //     `tests/results/${reportPdfFile.file_name}`,
            //     reportPdfFile.data,
            //     "binary",
            //     function(err) {
            //         if(err) {
            //             console.log(err);
            //             expect(false).toBeTruthy();

            //         } else {
            //             expect(true).toBeTruthy();
            //             console.log("The file was saved!");
            //         }
            //     });

            await chromeService.closeBrowser(browser);
            expect(true).toBeTruthy();
        },
    );

    it('should parse the template and return the output', async () => {
        // Arrange
        const lang = 'en';
        const timezone = 'Asia/Kuala_Lumpur';
        const templateService = new TemplateService(lang, timezone);
        const template = 'Hello {{name}}!';
        const data = { name: 'John' };

        // Arrange
        const result = await templateService._parseTemplate(template, data);

        // Assert
        expect(result).toEqual('Hello John!');
    });

    it('should throw an error if there is error while parsing template', async () => {
        // Arrange
        const lang = 'en';
        const timezone = 'Asia/Kuala_Lumpur';
        const templateService = new TemplateService(lang, timezone);
        const template = '<p>Hello, {{name}!</p>'; // invalid template - missing a closing brace
        const data = { name: 'John' };

        //Act
        const result = templateService._parseTemplate(template, data);

        // Assert
        await expect(result).rejects.toThrow();
    });
});
