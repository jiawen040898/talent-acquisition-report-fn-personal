import {
    FitModelType,
    FrameworkType,
    JobApplicationScoreType,
    JobDistributionScoreType,
    ReportDownloadNotificationType,
} from '../../../src/constants';
import {
    CompanyRes,
    ExportCandidateReportRequest,
    PersonalityFrameworkDetails,
} from '../../../src/interface';
import {
    Job,
    JobApplication,
    JobApplicationAttachment,
    JobApplicationCareer,
    JobApplicationContact,
    JobApplicationEducation,
    JobApplicationResume,
    JobApplicationScore,
    JobApplicationScreeningAnswer,
    JobDistributionScore,
    JobScreeningQuestion,
} from '../../../src/models';
import {
    testJobApplicationBuilder,
    testJobBuilder,
    testJobDistributionScoreBuilder,
} from '../../builders';
import { TestData, testUtil } from '../../setup';

const job = testJobBuilder.build();

const jobApplication = testJobApplicationBuilder.buildJobApplication({
    id: '00000000-0000-0000-0000-000000000002',
    job_id: job.id,
    company_id: TestData.companyId,
    created_at: new Date('2021-01-01'),
    last_status_changed_at: new Date('2021-01-01T00:00:00.000Z'),
    assessment_completed_at: null,
    primary_contact_email: TestData.email,
});

const jobApplicationCareer =
    testJobApplicationBuilder.buildJobApplicationCareer(jobApplication.id);

const jobApplicationCareer2 = {
    ...testJobApplicationBuilder.buildJobApplicationCareer(jobApplication.id),
    is_current: false,
    start_date: new Date('2022-01-01'),
    end_date: new Date('2022-10-01'),
};

const jobScreeningQuestions: JobScreeningQuestion[] = [
    testJobApplicationBuilder.buildJobScreeningQuestion(job.id),
];

const jobApplicationContact =
    testJobApplicationBuilder.buildJobApplicationContact(jobApplication.id);

const jobApplicationEducation =
    testJobApplicationBuilder.buildJobApplicationEducation(jobApplication.id);

const jobApplicationEducation2 = {
    ...testJobApplicationBuilder.buildJobApplicationEducation(
        jobApplication.id,
    ),
    is_highest: false,
    start_date: new Date('2022-01-01'),
    end_date: new Date('2022-10-01'),
};

const jobApplicationScore = testJobApplicationBuilder.buildJobApplicationScore(
    jobApplication.id,
    JobApplicationScoreType.ROLE_FIT,
    8.1,
    88,
);

const jobApplicationCultureScore =
    testJobApplicationBuilder.buildJobApplicationScore(
        jobApplication.id,
        JobApplicationScoreType.CULTURE_FIT,
        7.4,
        0,
    );

const jobApplicationCognitiveScore =
    testJobApplicationBuilder.buildJobApplicationScore(
        jobApplication.id,
        JobApplicationScoreType.REASONING_LOGICAL,
        85.0,
        0,
    );

const jobApplicationHardSkillScore = {
    ...testJobApplicationBuilder.buildJobApplicationScore(
        jobApplication.id,
        JobApplicationScoreType.HARD_SKILL,
        3.0,
        0,
    ),
    score_outcome: {
        pairwise_result: [
            {
                skill_name: 'Business Intelligence',
                matches: [
                    {
                        skill_name: 'Python',
                        score: 0.4610980749130249,
                        match: true,
                        source: 'candidate',
                    },
                    {
                        skill_name: 'testing',
                        score: 0.26443392038345337,
                        match: false,
                        source: 'daxtra',
                    },
                ],
            },
            {
                skill_name: 'Project Execution',
                matches: [
                    {
                        skill_name: 'Angular',
                        score: 0.44767916202545166,
                        match: true,
                        source: 'candidate',
                    },
                    {
                        skill_name: 'NodeJs',
                        score: 0.22911888360977173,
                        match: true,
                        source: 'daxtra',
                    },
                ],
            },
        ],
    },
};

const jobApplicationResume =
    testJobApplicationBuilder.buildJobApplicationResume(jobApplication.id);

const jobApplicationAttachment =
    testJobApplicationBuilder.buildJobApplicationAttachment(jobApplication.id);

const jobApplicationScreeningAnswer1 =
    testJobApplicationBuilder.buildJobApplicationScreeningAnswer(
        jobApplication.company_id,
        jobApplication.id,
        {
            attachment_file_id: jobApplicationAttachment.id,
        },
    );

const jobApplicationScreeningAnswer2 =
    testJobApplicationBuilder.buildJobApplicationScreeningAnswer(
        jobApplication.company_id,
        jobApplication.id,
        { tag: 'met_major' },
    );

const jobApplicationScreeningAnswers: JobApplicationScreeningAnswer[] = [
    jobApplicationScreeningAnswer1,
    jobApplicationScreeningAnswer2,
];

const mockExportCandidateReportRequest: ExportCandidateReportRequest = {
    job_application_id: jobApplication.id,
    idempotence_key: '00000000-0000-0000-0000-000000000001',
    count: 1,
    index: 1,
    variable: {
        company_id: TestData.companyId,
        user_account_id: TestData.createdBy,
        user_email: TestData.email,
        user_first_name: TestData.firstName,
        notification_type: ReportDownloadNotificationType.EMAIL,
    },
};

const companyResponse: CompanyRes = {
    id: TestData.companyId,
    name: TestData.companyName,
    slug: TestData.companySlug,
    locales: TestData.companyLocales,
    timezone: TestData.companyTimezone,
};

const mockAuth0CredentialSecretResponse = {
    AUTH0_ENTERPRISE_M2M_CLIENT_ID: 'xxx',
    AUTH0_ENTERPRISE_M2M_CLIENT_SECRET: 'xxx',
};

const mockMachineTokenResponse = {
    data: {
        access_token:
            'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJKTk5aZThSYl94Y2FaTmlpdmhEYyJ9.eyJpc3MiOiJodHRwczovL3NhbmRib3gtZW50ZXJwcmlzZS1pZC5wdWxzaWZpLm1lLyIsInN1YiI6IllWWUZ2VnF3MEJiak51ZGppME9nbUVvUUNmOEEyR2pyQGNsaWVudHMiLCJhdWQiOiJodHRwczovL3NhbmRib3guYXBpLnB1bHNpZmkubWUvIiwiaWF0IjoxNjY4OTk5MjE2LCJleHAiOjE2NjkwODU2MTYsImF6cCI6IllWWUZ2VnF3MEJiak51ZGppME9nbUVvUUNmOEEyR2pyIiwic2NvcGUiOiJjcmVhdGU6ZW1wbG95ZWVfdXNlcl9hY2NvdW50cyByZWFkOmlkZW50aXR5X3VzZXJzIGRlbGV0ZTppZGVudGl0eV91c2VycyByZWFkOmlkZW50aXR5X2NvbXBhbmllcyB1cGRhdGU6aWRlbnRpdHlfdXNlcnMiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMiLCJwZXJtaXNzaW9ucyI6WyJjcmVhdGU6ZW1wbG95ZWVfdXNlcl9hY2NvdW50cyIsInJlYWQ6aWRlbnRpdHlfdXNlcnMiLCJkZWxldGU6aWRlbnRpdHlfdXNlcnMiLCJyZWFkOmlkZW50aXR5X2NvbXBhbmllcyIsInVwZGF0ZTppZGVudGl0eV91c2VycyJdfQ.z906KnY5UVbW3pETCxAongu6FDfakXv_9zU_oYErap_pbVVUI7kXqXRkrB2R46Av_CCFMg5tWrK3wDOiVG_2kU9myWIB5_ogAZC4CxyyP3KLM9na3InS4qa6dgzIcnyz4laFocKIndisMrGWTmRJGhRBH3wQarv9dlm32AHQHU8MVGmlGwZaPIjmAmBfGfa3DoWYZYVNAILw2cbg5q6QkE7OIx7LNwBVvvcubZazxew3rUhCsYgo7ARcgyPQGS3kW7CtviwuPRbEGELSTvYl82odJf58hANMEne8jggP4gqDLBSEGpPBwK_2r9yq4ALyBjKMxY3a-gS4bHQPfxxCDw',
        scope: 'create:employee_user_accounts read:identity_users delete:identity_users read:identity_companies update:identity_users',
        expires_in: 86400,
        token_type: 'Bearer',
    },
};

const frameworkDetailResponse: PersonalityFrameworkDetails = {
    id: 0,
    alias: 'POLARIS',
    name: 'POLARIS',
    description: 'POLARIS',
    framework_recipes: [],
};

const reasoningAverage = testJobDistributionScoreBuilder.build({
    score_type: JobDistributionScoreType.REASONING_AVERAGE,
    job_id: jobApplication.job_id,
    updated_at: new Date('2024-01-01'),
    created_at: new Date('2024-01-01'),
});

const reasoningNumerical = testJobDistributionScoreBuilder.build({
    score_type: JobDistributionScoreType.REASONING_NUMERIC,
    job_id: jobApplication.job_id,
    updated_at: new Date('2024-01-01'),
    created_at: new Date('2024-01-01'),
});

const reasoningVerbal = testJobDistributionScoreBuilder.build({
    score_type: JobDistributionScoreType.REASONING_VERBAL,
    job_id: jobApplication.job_id,
    updated_at: new Date('2024-01-01'),
    created_at: new Date('2024-01-01'),
});

const reasoningLogical = testJobDistributionScoreBuilder.build({
    score_type: JobDistributionScoreType.REASONING_LOGICAL,
    job_id: jobApplication.job_id,
    updated_at: new Date('2024-01-01'),
    created_at: new Date('2024-01-01'),
});

const workStyle = testJobDistributionScoreBuilder.build({
    score_type: JobDistributionScoreType.WORK_STYLE,
    job_id: jobApplication.job_id,
    updated_at: new Date('2024-01-01'),
    created_at: new Date('2024-01-01'),
});

const workValue = testJobDistributionScoreBuilder.build({
    job_id: jobApplication.job_id,
    updated_at: new Date('2024-01-01'),
    created_at: new Date('2024-01-01'),
});

const jobDistributionScores = [
    reasoningAverage,
    reasoningLogical,
    reasoningNumerical,
    reasoningVerbal,
    workStyle,
    workValue,
];

const getFitScoreRecipeResponse = {
    id: testUtil.mockUuid(1),
    company_id: TestData.companyId,
    fit_score_type: FrameworkType.ROLE_FIT,
    fit_model_type: FitModelType.TEMPLATE,
    job_title: null,
    job_competency: ['testing', 'coding'],
    recipe: [
        {
            weightage: 0.06545028456645463,
            ingredient_alias: 'achievement_effort',
            ingredient_group: 'work_style',
        },
        {
            weightage: 0.06863073317710076,
            ingredient_alias: 'persistence',
            ingredient_group: 'work_style',
        },
        {
            weightage: 0.06528289253431536,
            ingredient_alias: 'initiative',
            ingredient_group: 'work_style',
        },
        {
            weightage: 0.04871108135252762,
            ingredient_alias: 'leadership',
            ingredient_group: 'work_style',
        },
        {
            weightage: 0.06243722798794777,
            ingredient_alias: 'cooperation',
            ingredient_group: 'work_style',
        },
        {
            weightage: 0.045698024774020754,
            ingredient_alias: 'concern_for_others',
            ingredient_group: 'work_style',
        },
        {
            weightage: 0.031134917977904252,
            ingredient_alias: 'social_orientation',
            ingredient_group: 'work_style',
        },
        {
            weightage: 0.0594241714094409,
            ingredient_alias: 'self_control',
            ingredient_group: 'work_style',
        },
        {
            weightage: 0.06160026782725142,
            ingredient_alias: 'stress_tolerance',
            ingredient_group: 'work_style',
        },
        {
            weightage: 0.06310679611650485,
            ingredient_alias: 'adaptability_flexibility',
            ingredient_group: 'work_style',
        },
        {
            weightage: 0.06930030130565784,
            ingredient_alias: 'dependability',
            ingredient_group: 'work_style',
        },
        {
            weightage: 0.07766990291262135,
            ingredient_alias: 'attention_to_detail',
            ingredient_group: 'work_style',
        },
        {
            weightage: 0.07331771007700033,
            ingredient_alias: 'integrity',
            ingredient_group: 'work_style',
        },
        {
            weightage: 0.06310679611650485,
            ingredient_alias: 'independence',
            ingredient_group: 'work_style',
        },
        {
            weightage: 0.06779377301640441,
            ingredient_alias: 'innovation',
            ingredient_group: 'work_style',
        },
        {
            weightage: 0.07733511884834282,
            ingredient_alias: 'analytical_thinking',
            ingredient_group: 'work_style',
        },
        {
            weightage: 0.17573359709858227,
            ingredient_alias: 'achievement',
            ingredient_group: 'work_value',
        },
        {
            weightage: 0.16485328058028356,
            ingredient_alias: 'independence',
            ingredient_group: 'work_value',
        },
        {
            weightage: 0.16485328058028356,
            ingredient_alias: 'recognition',
            ingredient_group: 'work_value',
        },
        {
            weightage: 0.13188262446422686,
            ingredient_alias: 'relationships',
            ingredient_group: 'work_value',
        },
        {
            weightage: 0.16485328058028356,
            ingredient_alias: 'support',
            ingredient_group: 'work_value',
        },
        {
            weightage: 0.19782393669634024,
            ingredient_alias: 'working_conditions',
            ingredient_group: 'work_value',
        },
        {
            weightage: 0.14258801365830684,
            ingredient_alias: 'work_value',
            ingredient_group: 'recipe',
        },
        {
            weightage: 0.14258801365830684,
            ingredient_alias: 'work_style',
            ingredient_group: 'recipe',
        },
        {
            weightage: 0.14258801365830684,
            ingredient_alias: 'interest_riasec',
            ingredient_group: 'recipe',
            ingredient_attribute: 'I,R,C',
        },
        {
            weightage: 0.19427764040974915,
            ingredient_alias: 'reasoning_verbal',
            ingredient_group: 'recipe',
        },
        {
            weightage: 0.20826563051925115,
            ingredient_alias: 'reasoning_logical',
            ingredient_group: 'recipe',
        },
        {
            weightage: 0.16969268809607915,
            ingredient_alias: 'reasoning_numeric',
            ingredient_group: 'recipe',
        },
        {
            weightage: 0.16969268809607915,
            ingredient_alias: 'hard_skills',
            ingredient_group: 'recipe',
        },
    ],
    questionnaire: [
        {
            questionnaire_id: 30,
            questionnaire_framework: 'personality',
        },
        {
            questionnaire_id: 25,
            questionnaire_framework: 'work_interest',
        },
        {
            questionnaire_id: 26,
            questionnaire_framework: 'work_value',
        },
        {
            questionnaire_id: 27,
            questionnaire_framework: 'reasoning_verbal',
        },
        {
            questionnaire_id: 28,
            questionnaire_framework: 'reasoning_logic',
        },
        {
            questionnaire_id: 29,
            questionnaire_framework: 'reasoning_numeric',
        },
    ],
    competency_inclusiveness: false,
    framework_alias: 'POLARIS',
};

const entitiesToBeAdded = [
    {
        entityClass: Job,
        data: [job],
    },
    { entityClass: JobScreeningQuestion, data: jobScreeningQuestions },
    {
        entityClass: JobApplication,
        data: [jobApplication],
    },
    {
        entityClass: JobApplicationCareer,
        data: [jobApplicationCareer, jobApplicationCareer2],
    },
    {
        entityClass: JobApplicationEducation,
        data: [jobApplicationEducation, jobApplicationEducation2],
    },
    {
        entityClass: JobApplicationContact,
        data: [jobApplicationContact],
    },
    {
        entityClass: JobApplicationScore,
        data: [
            jobApplicationScore,
            jobApplicationCultureScore,
            jobApplicationCognitiveScore,
            jobApplicationHardSkillScore,
        ],
    },
    {
        entityClass: JobApplicationAttachment,
        data: jobApplicationAttachment,
    },
    {
        entityClass: JobApplicationScreeningAnswer,
        data: jobApplicationScreeningAnswers,
    },
    {
        entityClass: JobApplicationResume,
        data: jobApplicationResume,
    },
    {
        entityClass: JobDistributionScore,
        data: jobDistributionScores,
    },
];

export const testData = {
    entitiesToBeAdded,
    mockExportCandidateReportRequest,
    companyResponse,
    getFitScoreRecipeResponse,
    mockAuth0CredentialSecretResponse,
    mockMachineTokenResponse,
    frameworkDetailResponse,
};
