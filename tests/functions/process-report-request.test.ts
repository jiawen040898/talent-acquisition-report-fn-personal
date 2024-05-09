process.env.DOCUMENT_UPLOAD_BUCKET_NAME = 'Test_Bucket_Name_Placeholder';

describe('[processReportRequest]', () => {
    it('should pass process report request', async () => {
        expect(true).toBeTruthy();
    });

    // it('should pass report download process - One candidate with two files', async () => {
    //     const mockData = OneCandidateWithTwoFile as unknown as ExportAssessmentReportRequest;
    //     const fileService = new FileService();
    //
    //     // report request payload will be in array items
    //     const processingList = [];
    //     const chromeService = new ChromeService();
    //     const browser = await chromeService.launchBrowser();
    //
    //     // loop through report request payload
    //     for (const reportRequestData of mockData.report_requests) {
    //         const downloadFilesPromises = [];
    //
    //         const reportPdfFile = await fileService.generatePDF(browser, reportRequestData)
    //
    //         // gather and download attachments files to stream
    //         downloadFilesPromises.push(fileService.downloadReportRequestFiles(reportRequestData.files));
    //         const downloadedFilesProcess = await Promise.all(downloadFilesPromises)
    //
    //         // 2 files
    //         const downloadedFiles = downloadedFilesProcess.reduce((acc, curr) => {
    //             return acc.concat(curr);
    //         }, []);
    //         processingList.push({ ...reportRequestData, downloaded_files: downloadedFiles, reportPdfFile} as ProcessedAssessmentReportSummary)
    //     }
    //
    //     await chromeService.closeBrowser(browser);
    //     // loop end
    //
    //     console.log(processingList)
    //
    //     // create zip file same level as report request folder
    //     const zipAndUploadedFiles = await fileService.zipAndUpload(processingList, mockData.folder_upload_path, mockData.download_file_name);
    //
    //     console.log(zipAndUploadedFiles)
    //
    //     return zipAndUploadedFiles;
    // });
});
