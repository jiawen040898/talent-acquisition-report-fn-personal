import { generatorUtil, objectParser } from '@pulsifi/fn';

import {
    ContactType,
    JobApplicationScoreType,
    JobApplicationSkillProficiency,
    JobApplicationSkillSource,
    JobApplicationStatus,
    ScreeningCriteriaStatus,
    ScreeningQuestionWidgetType,
} from '../../src/constants';
import {
    JobApplication,
    JobApplicationAttachment,
    JobApplicationCareer,
    JobApplicationContact,
    JobApplicationEducation,
    JobApplicationLabel,
    JobApplicationResume,
    JobApplicationScore,
    JobApplicationScreeningAnswer,
    JobScreeningQuestion,
} from '../../src/models';
import { TestData } from '../setup';

const placeDto = {
    place_id: 'place_id',
    display_address: 'display_address',
    vicinity: 'vicinity',
    street_number: 'street_number',
    street_name: 'street_name',
    postal_code: 'postal_code',
    locality: 'locality',
    sublocality: 'sublocality',
    state: 'state',
    country: 'country',
    geolocation: {
        latitude: '39.19109830',
        longitude: '-106.81753870',
    },
};

let id = 0;
let questionHashCode = 0;
let screeningQuestionId = 0;

export const testJobApplicationBuilder = {
    buildJobApplication: (
        fieldsToUpdate: Partial<JobApplication>,
    ): JobApplication => ({
        id: generatorUtil.uuid(),
        job_id: generatorUtil.uuid(),
        company_id: 5,
        ext_candidate_job_application_id: generatorUtil.uuid(),
        user_account_id: 7,
        status: JobApplicationStatus.APPLIED,
        last_status_changed_at: TestData.now,
        first_name: 'Simon',
        last_name: 'Peter',
        place_formatted_address: '1 Pulsifi Road, Pulsifi Garden, 49990, KL.',
        place_result: objectParser.toJSON(placeDto),
        source: 'Pulsifi',
        nationality: 'Malaysian',
        is_questionnaires_required: true,
        is_video_required: true,
        has_passed_screening: true,
        total_questionnaires_completed: 4,
        total_questionnaires: 2,
        total_screenings_completed: 3,
        total_screenings: 1,
        assessment_completion_percentage: 75,
        criteria_met_percentage: 75,
        role_fit_score: 8.1,
        culture_fit_score: 8.2,
        submitted_at: TestData.now,
        completed_at: TestData.now,
        assessment_completed_at: TestData.now,
        seen_at: null,
        average_rating: 4,
        total_rating_submitted: 3,
        is_deleted: false,
        primary_contact_email: 'test@pulsifi.co',
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
            {
                name: 'testing',
                proficiency: JobApplicationSkillProficiency.EXPERT,
                source: JobApplicationSkillSource.DAXTRA,
            },
        ],
        ...TestData.auditData,
        ...fieldsToUpdate,
    }),

    buildJobApplicationCareer: (
        jobApplicationId: string,
    ): JobApplicationCareer => ({
        id: id++,
        job_application_id: jobApplicationId,
        is_current: true,
        organization: TestData.companyName,
        role: 'QA',
        start_date: new Date('2023-01-01'),
        end_date: new Date('2023-10-01'),
        description: 'Activity Description',
        responsibilities_achievements:
            'This is my achievement and responsibility',
        place_formatted_address: '1 Pulsifi Road, Pulsifi Garden, 49990, KL.',
        place_result: objectParser.toJSON(placeDto),
        ...TestData.auditData,
    }),

    buildJobApplicationContact: (
        jobApplicationId: string,
    ): JobApplicationContact => ({
        id: id++,
        job_application_id: jobApplicationId,
        contact_type: ContactType.EMAIL,
        is_primary: true,
        value: TestData.email,
        ...TestData.auditData,
    }),

    buildJobApplicationEducation: (
        jobApplicationId: string,
    ): JobApplicationEducation => ({
        id: id++,
        job_application_id: jobApplicationId,
        parent_id: 1,
        major_first: 'major_first',
        major_second: 'major_second',
        degree_name: 'degree_name',
        school_name: 'school_name',
        grade_type: 'grade_type',
        grade_value: '1',
        grade_value_max: 2,
        grade_description: 'degree_name',
        start_date: new Date('2023-01-01'),
        end_date: new Date('2023-10-01'),
        is_highest: true,
        description: 'description',
        others: 'others',
        achievements: 'This is my achievements',
        ...TestData.auditData,
    }),

    buildJobApplicationResume: (
        jobApplicationId: string = generatorUtil.uuid(),
    ): JobApplicationResume => ({
        id: id++,
        job_application_id: jobApplicationId,
        file_name: 'resume.pdf',
        file_path: 'http://docs.pulsifi.me/cloud-url/resume.pdf',
        original_file_path: '//resumes',
        content_path: undefined,
        is_primary: true,
        ...TestData.auditData,
    }),

    buildJobApplicationAttachment: (
        jobApplicationId: string,
    ): JobApplicationAttachment => ({
        id: id++,
        job_application_id: jobApplicationId,
        file_name: 'attachment.pdf',
        file_path: 'http://docs.pulsifi.me/cloud-url/attachment.pdf',
        ...TestData.auditData,
    }),

    buildJobApplicationScore: (
        jobApplicationId: string,
        scoreType: JobApplicationScoreType,
        score: number,
        percentile: number,
    ): JobApplicationScore => ({
        id: id++,
        job_application_id: jobApplicationId,
        percentile,
        percentile_api_version: 'v1.0',
        percentile_source: 'Pulsifi',
        score_recipe_id: generatorUtil.uuid(),
        score_dimension: 2,
        score_type: scoreType,
        score,
        score_outcome: {} as JSON,
        ...TestData.auditData,
    }),

    buildJobScreeningQuestion: (jobId: string): JobScreeningQuestion => ({
        id: screeningQuestionId++,
        job_id: jobId,
        alias: 'grade_level',
        order_no: 123,
        schema: objectParser.toJSON({
            ui: {
                widget: ScreeningQuestionWidgetType.SINGLE_SELECTION,
            },
            enum: ['a', 'b', 'c'],
            title: '',
            required: true,
        }),
        rule: objectParser.toJSON({
            event: {
                type: 'Met Grade',
            },
            conditions: {
                any: [
                    {
                        all: [
                            {
                                fact: 'gradeLevel',
                                path: '$.value',
                                value: 2.1,
                                operator: 'equal',
                            },
                        ],
                    },
                ],
            },
        }),
        is_filterable: false,
        created_by: TestData.createdBy,
        updated_by: TestData.createdBy,
    }),

    buildJobApplicationScreeningAnswer: (
        companyId: number,
        jobApplicationId: string,
        fieldsToUpdate: Partial<JobApplicationScreeningAnswer> = {},
    ): JobApplicationScreeningAnswer => ({
        id: id++,
        company_id: companyId,
        job_application_id: jobApplicationId,
        job_screening_question_id: 0,
        order_no: 0,
        question: objectParser.toJSON({
            id: 159684,
            rule: {
                event: { type: 'Education Level' },
                conditions: {
                    all: [
                        {
                            fact: 'degree_name',
                            value: ['doctorate', 'master', 'bachelor'],
                            operator: 'in',
                        },
                    ],
                },
            },
            alias: 'education_level',
            schema: {
                ui: { widget: null },
                enum: [],
                title: 'Education Level',
                required: true,
            },
            order_no: 1,
        }),
        answer: objectParser.toJSON({ value: 'bachelor' }),
        tag: 'met_grade',
        criteria_status: ScreeningCriteriaStatus.PASS,
        question_hash_code: ++questionHashCode,
        ...TestData.auditData,
        ...fieldsToUpdate,
    }),

    buildJobApplicationLabel: (
        companyId: number,
        jobApplicationId: string,
        fieldsToUpdate: Partial<JobApplicationLabel> = {},
    ): JobApplicationLabel => ({
        id: id++,
        company_id: companyId,
        job_application_id: jobApplicationId,
        value: 'good',
        ...TestData.auditData,
        ...fieldsToUpdate,
    }),
};
