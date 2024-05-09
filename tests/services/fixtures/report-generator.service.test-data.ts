import {
    JobApplicationSkillProficiency,
    JobApplicationSkillSource,
    ReportDownloadNotificationType,
} from '../../../src/constants';
import {
    RenderAssessmentReportData,
    RenderAssessmentReportResultData,
} from '../../../src/interface';

const mockRenderAssessmentReportData: RenderAssessmentReportData = {
    report_request: {
        count: 1,
        idempotence_key: '00000000-0000-0000-0000-000000000001',
        index: 1,
        job_application_id: '00000000-0000-0000-0000-000000000002',
        variable: {
            company_id: 5,
            locale: 'en-US',
            timezone: 'Asia/Kuala_Lumpur',
            user_account_id: 1,
            user_email: 'jaypete@gmail.com',
            user_first_name: 'Jay',
            notification_type: ReportDownloadNotificationType.EMAIL,
        },
    },
    report_summary: {
        address: '1 Pulsifi Road, Pulsifi Garden, 49990, KL.',
        application_status: 'applied',
        assessment_descriptor_overview: {
            thrive: [],
            watch_out: [],
            working_with: [],
        },
        assessment_scores: {
            culture_fit: [],
            hard_skills: [
                {
                    match: true,
                    name: 'Python',
                },
                {
                    match: false,
                    name: 'testing',
                },
                {
                    match: true,
                    name: 'Angular',
                },
                {
                    match: true,
                    name: 'NodeJs',
                },
            ],
            reasoning_average: undefined,
            reasoning_logical: {
                percentile: 7,
                score: 0.07,
            },
            reasoning_numeric: undefined,
            reasoning_verbal: undefined,
            role_fit: [
                {
                    ingredient_alias: 'reasoning_average',
                    ingredient_score: undefined,
                    ingredient_weightage: 0.1907453196750265,
                },
                {
                    ingredient_alias: 'hard_skills',
                    ingredient_score: undefined,
                    ingredient_weightage: 0.16969268809607915,
                },
                {
                    ingredient_alias: 'work_value',
                    ingredient_score: undefined,
                    ingredient_weightage: 0.14258801365830684,
                },
                {
                    ingredient_alias: 'work_style',
                    ingredient_score: undefined,
                    ingredient_weightage: 0.14258801365830684,
                },
                {
                    ingredient_alias: 'interest_riasec',
                    ingredient_score: undefined,
                    ingredient_weightage: 0.14258801365830684,
                },
            ],
            work_interest: [],
            work_style: [],
            work_value: [],
        },
        company_name: 'Pulsifi',
        contact_email: 'jaypete@gmail.com',
        contact_mobile_number: '',
        culture_fit_framework_descriptor: 'POLARIS',
        culture_fit_framework_name: 'POLARIS',
        culture_fit_score: 8.2,
        experiences: {
            careers: [
                {
                    end_date: new Date('2023-10-01T00:00:00.000Z'),
                    is_current: true,
                    organization: 'Pulsifi',
                    place_formatted_address:
                        '1 Pulsifi Road, Pulsifi Garden, 49990, KL.',
                    responsibilities_achievements:
                        'This is my achievement and responsibility',
                    role: 'QA',
                    start_date: new Date('2023-10-01T00:00:00.000Z'),
                },
                {
                    end_date: new Date('2022-10-01T00:00:00.000Z'),
                    is_current: false,
                    organization: 'Pulsifi',
                    place_formatted_address:
                        '1 Pulsifi Road, Pulsifi Garden, 49990, KL.',
                    responsibilities_achievements:
                        'This is my achievement and responsibility',
                    role: 'QA',
                    start_date: new Date('2022 - 01 - 01T00: 00: 00.000Z'),
                },
            ],
            educations: [
                {
                    achievements: 'This is my achievements',
                    degree_name: 'degree_name',
                    end_date: new Date('2023-10-01T00:00:00.000Z'),
                    grade_cgpa: 0,
                    is_highest: true,
                    major_first: 'major_first',
                    major_second: 'major_second',
                    school_name: 'school_name',
                    start_date: new Date('2023-10-01T00:00:00.000Z'),
                },
                {
                    achievements: 'This is my achievements',
                    degree_name: 'degree_name',
                    end_date: new Date('2022-10-01T00:00:00.000Z'),
                    grade_cgpa: 0,
                    is_highest: false,
                    major_first: 'major_first',
                    major_second: 'major_second',
                    school_name: 'school_name',
                    start_date: new Date('2022-01-01T00:00:00.000Z'),
                },
            ],
            professional_summary: 'This is my professional summary',
            skills: [
                {
                    name: 'Python',
                    proficiency: JobApplicationSkillProficiency.EXPERT,
                    source: JobApplicationSkillSource.CANDIDATE,
                },
                {
                    name: 'Angular',
                    proficiency: JobApplicationSkillProficiency.EXPERT,
                    source: JobApplicationSkillSource.CANDIDATE,
                },
                {
                    name: 'NodeJs',
                    proficiency: JobApplicationSkillProficiency.EXPERT,
                    source: JobApplicationSkillSource.CANDIDATE,
                },
            ],
        },
        files: [
            {
                file_name: 'Simon Peter Resume.pdf',
                file_path:
                    'https://pulsifi-sandbox-document.s3-ap-southeast-1.amazonaws.com/http://docs.pulsifi.me/cloud-url/resume.pdf',
            },
            {
                file_name: 'Simon Peter Attachment-0.pdf',
                file_path:
                    'https://pulsifi-sandbox-document.s3-ap-southeast-1.amazonaws.com/http://docs.pulsifi.me/cloud-url/attachment.pdf',
            },
        ],
        first_name: 'Simon',
        has_assessment_completed: false,
        has_passed_screening: true,
        interview_rating_summary: {
            company_name: 'Pulsifi',
            first_name: 'Simon',
            interview_average_rating: 4,
            interview_response: [],
            job_title: 'Tester',
            last_name: 'Peter',
            total_rating_submitted: 3,
        },
        job_title: 'Tester',
        last_name: 'Peter',
        last_position: 'QA at Pulsifi',
        nationality: 'Malaysian',
        role_fit_score: 8.1,
        screening_answers: [
            {
                answer: 'bachelor',
                criteria_status: 'pass',
                question: 'Education Level',
                required: true,
                tag: 'met_grade',
            },
            {
                answer: 'bachelor',
                criteria_status: 'pass',
                question: 'Education Level',
                required: true,
                tag: 'met_major',
            },
        ],
        screening_tags: ['met_grade', 'met_major'],
        source: 'Pulsifi',
        total_assessment: 2,
        total_assessment_completed: 4,
    },
};

const mockRenderAssessmentReportResultDataToEmail: RenderAssessmentReportResultData =
    {
        folderPath: 'report/assessment/5/00000000-0000-0000-0000-000000000001',
        count: 1,
        variable: mockRenderAssessmentReportData.report_request.variable,
    };

const mockRenderAssessmentReportResultDataToInApp: RenderAssessmentReportResultData =
    {
        folderPath: 'report/assessment/5/00000000-0000-0000-0000-000000000001',
        count: 1,
        variable: {
            ...mockRenderAssessmentReportData.report_request.variable,
            notification_type: ReportDownloadNotificationType.PUSHER,
            correlation_id: '00000000-0000-0000-0000-000000000003',
        },
    };

export const testData = {
    mockRenderAssessmentReportData,
    mockRenderAssessmentReportResultDataToEmail,
    mockRenderAssessmentReportResultDataToInApp,
};
