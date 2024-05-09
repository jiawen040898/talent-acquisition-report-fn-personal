import { DescriptorSummary } from '@pulsifi/descriptor-lib/types/common/interfaces/descriptor.interface';
import {
    IngredientOutcome,
    PersonalityOutcome,
} from '@pulsifi/descriptor-lib/types/common/interfaces/personality.interface';
import { Buffer } from 'buffer';

import {
    JobApplicationSkillProficiency,
    JobApplicationSkillSource,
    ReportDownloadNotificationType,
    ScreeningQuestionWidgetType,
} from '../constants';
import { EmailRequest } from './email-request';
import {
    QuestionAnswer,
    QuestionContents,
    RatingScore,
} from './interview-rating.interface';
import { PairwiseMatchDisplay } from './job-application-score.interface';

export interface AssessmentReportSummary {
    first_name: string;
    last_name: string;
    contact_email: string;
    contact_mobile_number: string;
    address: string;
    nationality: string;
    last_position: string;
    experiences: Experiences;
    source: string;
    job_title: string;
    company_name: string;
    application_status: string;
    has_passed_screening: boolean;
    has_assessment_completed: boolean;
    total_assessment: number;
    total_assessment_completed: number;
    role_fit_score?: number;
    culture_fit_score?: number;
    culture_fit_framework_name?: string;
    culture_fit_framework_descriptor?: string;
    assessment_descriptor_overview: DescriptorSummary;
    assessment_scores: AssessmentScoreSummary;
    hard_skills?: PairwiseMatchDisplay[];
    screening_tags?: string[];
    screening_answers?: ScreeningQuestionSummary[];
    files?: FileDownload[];
    interview_rating_summary?: InterviewResponseSummary;
}

export interface InterviewResponseSummary {
    first_name: string;
    last_name: string;
    job_title: string;
    company_name: string;
    interview_average_rating: number; //overall score
    total_rating_submitted: number;
    interview_response: InterviewResponse[];
}

export interface JobScoreRecipe {
    weightage: number;
    ingredient_alias: string;
    ingredient_group: string;
    ingredient_attribute?: string;
}

export interface InterviewResponse {
    score: number;
    note: string | null;
    submitted_at: Date | null;
    respondent_name: string | number;
    questions: Question[];
}

export interface Question {
    question_title: string;
    question_content: QuestionContents[];
    answers: QuestionAnswer;
    score: RatingScore;
    note: string | null;
    question_type: string;
    interview_template_name: string;
    dimension_level: string;
}

export interface ProcessedAssessmentReportSummary
    extends AssessmentReportSummary {
    downloaded_files?: FileUpload[];
    reportPdfFile?: FileUpload;
    reportPdfFiles?: FileUpload[];
}

export interface ExportAssessmentReportRequest {
    email_request?: EmailRequest;
    report_requests: AssessmentReportSummary[];
    folder_upload_path: string;
    download_file_name: string;
    company_id: number;
    locale: string;
    timezone: string;
}

export interface AssessmentScoreSummary {
    role_fit: IngredientOutcome[];
    culture_fit: PersonalityOutcome[];
    work_interest: PersonalityOutcome[];
    work_style: PersonalityOutcome[];
    work_value: PersonalityOutcome[];
    hard_skills: PairwiseMatchDisplay[];
    reasoning_average: CognitiveScore | undefined;
    reasoning_numeric: CognitiveScore | undefined;
    reasoning_logical: CognitiveScore | undefined;
    reasoning_verbal: CognitiveScore | undefined;
}

export interface CognitiveScoreWithType extends CognitiveScore {
    score_type?: string;
}

export interface PersonalityFrameworkRecipe {
    id: number;
    alias: string;
    name: string;
    description: string;
}

export interface PersonalityFrameworkDetails {
    id: number;
    alias: string;
    name: string;
    description: string;
    framework_recipes: PersonalityFrameworkRecipe[];
}

export interface CustomIngredientOutcome extends IngredientOutcome {
    tag: number;
    annotate: 'very important' | 'important' | null;
    annotation: 'balance' | null;
}

export interface CognitiveScore {
    score: number;
    percentile: number;
}

export interface ScreeningQuestionSummary {
    question: string;
    answer: string | string[];
    tag: string;
    required: boolean;
    criteria_status: string;
}

export interface FileDownload {
    file_name: string;
    file_path?: string;
}

export interface FileUpload extends FileDownload {
    data: Buffer;
}

export interface AttachmentFile {
    id: number;
    order_no: number;
}

export interface FileServiceOptions {
    template?: string;
    fileName?: string;
    language?: string;
    timezone?: string;
}

export interface JobApplicationSkill {
    name: string;
    source: JobApplicationSkillSource;
    proficiency?: JobApplicationSkillProficiency | null;
    match?: boolean;
}

export interface Experiences {
    careers: Careers[];
    educations: Educations[];
    skills: JobApplicationSkill[];
    professional_summary: string | null;
}

export interface Careers {
    organization: string;
    role: string;
    is_current: boolean;
    responsibilities_achievements: string | null;
    place_formatted_address: string | null;
    start_date: Date | null;
    end_date: Date | null;
}

export interface Educations {
    major_first: string | null;
    major_second: string | null;
    grade_cgpa: number | null;
    school_name: string | null;
    degree_name: string | null;
    achievements: string | null;
    start_date: Date | null;
    end_date: Date | null;
    is_highest: boolean;
}

export interface RenderAssessmentReport {
    Items: RenderAssessmentReportData[];
    BatchInput?: {
        Key: string;
        [key: string]: string;
    };
}

export interface RenderAssessmentReportData {
    report_request: ExportCandidateReportRequest;
    report_summary: AssessmentReportSummary;
}

export interface RenderAssessmentReportResultData {
    folderPath: string;
    count: number;
    variable: ExportCandidateReportRequestVariable;
}

export interface ExportCandidateReportRequest {
    job_application_id: string;
    idempotence_key: string;
    count: number;
    index: number;
    variable: ExportCandidateReportRequestVariable;
}

export interface ExportCandidateReportRequestVariable {
    company_id: number;
    user_account_id: number;
    notification_type: ReportDownloadNotificationType;
    correlation_id?: string;
    share_setting?: ShareSetting;
    user_email?: string;
    user_first_name?: string;
    resource_id?: string;
    language?: string;
    locale?: string;
    timezone?: string;
}

type MapReasoningScoresBase = Record<string, CognitiveScore>;

export interface MappedReasoningScores extends MapReasoningScoresBase {
    reasoning_logical: CognitiveScore;
    reasoning_numeric: CognitiveScore;
    reasoning_verbal: CognitiveScore;
    reasoning_average: CognitiveScore;
}

export interface ScreeningQuestion {
    schema: ScreeningQuestionSchema;
}

export interface ScreeningQuestionSchema {
    ui: ScreeningQuestionSchemaWidget;
    title: string;
    required: boolean;
}

export interface ScreeningQuestionSchemaWidget {
    widget: ScreeningQuestionWidgetType;
}

export interface ScreeningAnswer {
    value: string | string[] | null;
}

export interface JobScoreRecipeConfigResponse {
    id: string;
    job_title: string;
    job_competency: string[];
    fit_score_type: string;
    questionnaire: AssessmentFramework[];
    recipe: JobScoreRecipe[];
    name?: string;
    framework_alias?: string;
}

export interface AssessmentFramework {
    questionnaire_framework: string;
    questionnaire_id: number;
}

export interface ComputePersonPercentileScore {
    population_id: string;
    population_type: string;
    scores: CognitiveScoreWithType[];
}

export interface ShareSetting {
    contact_info: boolean;
    resume: boolean;
    video_interview: boolean;
    screening_questions: boolean;
    public_comment: boolean;
    interview_kit: boolean;
    interview_review: boolean;
}
