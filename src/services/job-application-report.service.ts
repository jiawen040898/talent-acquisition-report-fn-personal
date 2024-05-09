import { getDimensionLevelByScore } from '@pulsifi/descriptor-lib';
import {
    DescriptorSummary,
    IngredientScore,
    PersonalityDomainScore,
} from '@pulsifi/descriptor-lib/types/common/interfaces';
import { numberUtil } from '@pulsifi/fn';
import { CountryList } from '@pulsifi/lookup';
import cdf from '@stdlib/stats-base-dists-beta-cdf';
import { keyBy } from 'lodash';
import { DataSource, In } from 'typeorm';

import {
    InterviewRatingQueryBuilder,
    JobApplicationQueryBuilder,
} from '../builders';
import {
    CacheTtl,
    ContactType,
    JobApplicationScoreType,
    JobApplicationSkillSource,
    ScreeningCriteriaStatus,
    ScreeningQuestionWidgetType,
} from '../constants';
import { getDataSource } from '../database';
import {
    AssessmentReportSummary,
    AssessmentScoreSummary,
    AttachmentFile,
    Careers,
    CognitiveScore,
    CognitiveScoreWithType,
    Educations,
    Experiences,
    ExportCandidateReportRequest,
    FileDownload,
    InterviewResponseSummary,
    MappedReasoningScores,
    PairwiseSkill,
    PairwiseTitle,
    PersonalityFrameworkDetails,
    RenderAssessmentReportData,
    ScoreOutcome,
    ScreeningAnswer,
    ScreeningQuestion,
    ScreeningQuestionSummary,
} from '../interface';
import {
    InterviewRating,
    Job,
    JobApplication,
    JobApplicationAttachment,
    JobApplicationCareer,
    JobApplicationEducation,
    JobApplicationResume,
    JobApplicationScore,
    JobApplicationScreeningAnswer,
    JobDistributionScore,
} from '../models';
import {
    getAttachmentFileName,
    getCompanyLocale,
    getCultureFitBreakdown,
    getPairwiseMatchTitleDisplay,
    getPersonalityDescriptorWithSummary,
    getResumeFileName,
    getRoleFitBreakdown,
    getUrlFromDocumentBucket,
    toPairwiseDisplay,
} from '../utils';
import { CompanyService } from './company.service';
import { PsychologyService } from './psychology.service';

type ContactInfo = {
    displayName: string;
    contactEmail: string;
    contactMobileNumber: string;
    address: string;
};

type ScreeningAnswerInfo = {
    screeningAnswerDisplay: ScreeningQuestionSummary[];
    screeningAnswerTag: string[];
    attachmentFiles: AttachmentFile[];
};

async function prepareAssessmentReportSummary(
    data: ExportCandidateReportRequest,
    dataSource: DataSource,
): Promise<RenderAssessmentReportData> {
    const jaBuilder = new JobApplicationQueryBuilder(
        dataSource.getRepository(JobApplication),
        data.variable.company_id,
    )
        .whereCompanyIs(data.variable.company_id)
        .whereJobApplicationIs(data.job_application_id)
        .leftJoinContacts(true)
        .innerJoinJob(true)
        .selectDetailsForReport()
        .build();

    const jobApplication = await jaBuilder.getOneOrFail();

    jobApplication.skills = (jobApplication.skills ?? []).filter(
        (skill) => skill.source === JobApplicationSkillSource.CANDIDATE,
    );

    const careers = await dataSource.getRepository(JobApplicationCareer).find({
        select: {
            organization: true,
            role: true,
            is_current: true,
            responsibilities_achievements: true,
            place_formatted_address: true,
            start_date: true,
            end_date: true,
        },
        where: {
            job_application_id: data.job_application_id,
        },
        order: {
            is_current: 'DESC',
            start_date: 'DESC',
        },
    });

    const educations = await dataSource
        .getRepository(JobApplicationEducation)
        .find({
            select: {
                school_name: true,
                major_first: true,
                major_second: true,
                grade_cgpa: true,
                degree_name: true,
                achievements: true,
                start_date: true,
                end_date: true,
                is_highest: true,
            },
            where: {
                job_application_id: data.job_application_id,
            },
            order: {
                is_highest: 'DESC',
                start_date: 'DESC',
            },
        });

    const companyService = new CompanyService();
    const company = await companyService.getCompanyById(
        data.variable.company_id,
    );

    data.variable.locale = getCompanyLocale(company);
    data.variable.timezone = company.timezone;

    const shareSetting = data.variable.share_setting;
    const contactInfo = getContactInfo(
        jobApplication,
        shareSetting?.contact_info ?? true,
    );

    const latestPosition = getLatestPosition(careers);

    const interviewRatingBuilder = new InterviewRatingQueryBuilder(
        dataSource.getRepository(InterviewRating),
    )
        .leftJoinRatingQuestions()
        .whereJobApplicationIs(data.job_application_id)
        .whereSubmittedAt()
        .orderByInterviewRatingQuestionOrderNo()
        .build();
    const interviewRatings = await interviewRatingBuilder.getMany();

    const reportSummary = <AssessmentReportSummary>{
        first_name: jobApplication.first_name,
        last_name: jobApplication.last_name,
        contact_email: contactInfo.contactEmail,
        contact_mobile_number: contactInfo.contactMobileNumber,
        last_position: latestPosition,
        address: contactInfo.address,
        nationality:
            CountryList.find((i) => i.iso === jobApplication.nationality)
                ?.nationality || jobApplication.nationality,
        source: jobApplication.source,
        application_status: jobApplication.status,
        job_title: jobApplication.job?.title,
        company_name: company.name,
        has_passed_screening: jobApplication.has_passed_screening,
        has_assessment_completed:
            jobApplication.assessment_completed_at !== null,
        total_assessment: jobApplication.total_questionnaires,
        total_assessment_completed:
            jobApplication.total_questionnaires_completed,
        role_fit_score: jobApplication.role_fit_score,
        culture_fit_score: jobApplication.culture_fit_score,
    };

    const screeningAnswerInfo = await populateScreeningAnswer(
        data.job_application_id,
        dataSource,
        shareSetting?.screening_questions,
    );

    reportSummary.screening_answers =
        screeningAnswerInfo.screeningAnswerDisplay;
    reportSummary.screening_tags = screeningAnswerInfo.screeningAnswerTag;

    const interviewRatingSummary = getInterviewResponse(
        company.name,
        jobApplication,
        interviewRatings,
        shareSetting?.interview_review,
    );

    reportSummary.interview_rating_summary = interviewRatingSummary;

    const {
        assessmentScoreSummary,
        assessmentOverview,
        frameworkName,
        frameworkDescription,
    } = await prepareAssessmentScoreDescriptorAndSummary(
        data.job_application_id,
        jobApplication.first_name,
        dataSource,
        jobApplication.job!,
        data.variable.locale,
    );

    const jobApplicationExperiences: Experiences = {
        careers: careers as Careers[],
        educations: educations as Educations[],
        skills: jobApplication.skills,
        professional_summary: jobApplication.professional_summary ?? null,
    };

    reportSummary.experiences = jobApplicationExperiences;
    reportSummary.assessment_descriptor_overview = assessmentOverview;
    reportSummary.assessment_scores = assessmentScoreSummary;
    reportSummary.culture_fit_framework_name = frameworkName;
    reportSummary.culture_fit_framework_descriptor = frameworkDescription;

    reportSummary.files = await prepareFileDownloads(
        data.job_application_id,
        contactInfo.displayName,
        screeningAnswerInfo.attachmentFiles,
        dataSource,
        shareSetting?.resume,
    );

    return <RenderAssessmentReportData>{
        report_request: data,
        report_summary: reportSummary,
    };
}

async function populateScreeningAnswer(
    jobApplicationId: string,
    dataSource: DataSource,
    includeScreeningQuestion: boolean = true,
): Promise<ScreeningAnswerInfo> {
    let attachmentFiles: AttachmentFile[] = [];
    let screeningAnswerDisplay: ScreeningQuestionSummary[] = [];
    let screeningAnswerTag: string[] = [];

    if (includeScreeningQuestion) {
        const screeningAnswer = await dataSource
            .getRepository(JobApplicationScreeningAnswer)
            .find({
                where: {
                    job_application_id: jobApplicationId,
                },
            });

        if (screeningAnswer && screeningAnswer.length > 0) {
            //filter non widget, legal and file upload question type
            screeningAnswerDisplay = screeningAnswer
                .filter(
                    (i) =>
                        (i.question as unknown as ScreeningQuestion).schema?.ui
                            ?.widget === null ||
                        Object.values(ScreeningQuestionWidgetType).includes(
                            (i.question as unknown as ScreeningQuestion).schema
                                ?.ui?.widget,
                        ),
                )
                .map((i) => {
                    return <ScreeningQuestionSummary>{
                        question: (i.question as unknown as ScreeningQuestion)
                            .schema?.title,
                        required: (i.question as unknown as ScreeningQuestion)
                            .schema?.required,
                        answer: (i.answer as unknown as ScreeningAnswer).value,
                        criteria_status: i.criteria_status,
                        tag:
                            i.criteria_status === ScreeningCriteriaStatus.PASS
                                ? i.tag
                                : null,
                    };
                });

            screeningAnswerTag = screeningAnswerDisplay
                .filter((i) => i.tag !== null)
                .map((i) => i.tag);
        }

        attachmentFiles = screeningAnswer
            .filter((i) => i.attachment_file_id)
            .map((i) => {
                return <AttachmentFile>{
                    id: i.attachment_file_id,
                    order_no: i.order_no,
                };
            });
    }

    return {
        screeningAnswerDisplay,
        screeningAnswerTag,
        attachmentFiles,
    };
}

async function prepareAssessmentScoreDescriptorAndSummary(
    jobApplicationId: string,
    firstName: string,
    dataSource: DataSource,
    job: Job,
    language?: string,
): Promise<{
    assessmentScoreSummary: AssessmentScoreSummary;
    assessmentOverview: DescriptorSummary;
    frameworkName?: string;
    frameworkDescription?: string;
}> {
    //get job_application_score
    const scores = await dataSource.getRepository(JobApplicationScore).find({
        where: {
            job_application_id: jobApplicationId,
        },
    });

    let roleFitResult: IngredientScore[] = [];
    let shouldShowHardSkillResult = false;

    const psychologyService = new PsychologyService();
    if (job.role_fit_recipe_id) {
        const fitScoreRecipe = await psychologyService.getFitScoreRecipeById(
            job.role_fit_recipe_id,
        );

        roleFitResult = getRoleFitBreakdown(
            job,
            scores,
            fitScoreRecipe?.recipe || [],
        );

        shouldShowHardSkillResult = roleFitResult.some(
            (i) => i.ingredient_alias === 'hard_skills',
        );
    }

    let cultureFitResult: PersonalityDomainScore[] = [];
    let frameworkDetail: PersonalityFrameworkDetails | undefined;
    if (job.culture_fit_recipe_id) {
        const jobCultureRecipe = await psychologyService.getFitScoreRecipeById(
            job.culture_fit_recipe_id,
        );

        frameworkDetail = await psychologyService.getFrameworkDetails(
            jobCultureRecipe.framework_alias as string,
            language,
        );

        cultureFitResult = getCultureFitBreakdown(scores, frameworkDetail);
    }

    const hardSkillOutcome = scores.find(
        (i) => i.score_type === JobApplicationScoreType.HARD_SKILL,
    )?.score_outcome as ScoreOutcome;

    const workExperienceOutcome = scores.find(
        (i) => i.score_type === JobApplicationScoreType.WORK_EXPERIENCE,
    )?.score_outcome as ScoreOutcome;

    const { workInterest, workStyle, workValue, assessmentOverview } =
        getPersonalityDescriptorWithSummary(scores, firstName, language);

    const reasoningScores = <MappedReasoningScores>{
        reasoning_average: prepareReasoningScore(
            scores,
            JobApplicationScoreType.REASONING_AVERAGE,
        ),
        reasoning_logical: prepareReasoningScore(
            scores,
            JobApplicationScoreType.REASONING_LOGICAL,
        ),
        reasoning_numeric: prepareReasoningScore(
            scores,
            JobApplicationScoreType.REASONING_NUMERIC,
        ),
        reasoning_verbal: prepareReasoningScore(
            scores,
            JobApplicationScoreType.REASONING_VERBAL,
        ),
    };

    const percentileScoresResult = await getPercentileResult(job.id, scores);

    if (percentileScoresResult.length > 0) {
        if (roleFitResult.length > 0) {
            percentileScoresResult.forEach((i) => {
                const foundScore = roleFitResult.find(
                    (r) => r.ingredient_alias === i.score_type,
                );
                if (foundScore) {
                    foundScore.ingredient_percentile = i.percentile;
                }
            });
        }

        Object.keys(reasoningScores).forEach((i) => {
            const foundScore = percentileScoresResult.find(
                (s) => s.score_type === i,
            );

            if (foundScore && reasoningScores[i]) {
                reasoningScores[i].percentile = foundScore.percentile;
            }
        });
    }

    const assessmentScoreSummary = <AssessmentScoreSummary>{
        role_fit: roleFitResult,
        culture_fit: cultureFitResult,
        hard_skills:
            shouldShowHardSkillResult && hardSkillOutcome
                ? toPairwiseDisplay(
                      hardSkillOutcome.pairwise_result as PairwiseSkill[],
                  )
                : undefined,
        work_experience:
            shouldShowHardSkillResult && workExperienceOutcome
                ? getPairwiseMatchTitleDisplay(
                      workExperienceOutcome?.pairwise_result as PairwiseTitle[],
                  )
                : undefined,
        work_interest: workInterest,
        work_style: workStyle,
        work_value: workValue,
        ...reasoningScores,
    };

    return {
        assessmentScoreSummary,
        assessmentOverview,
        frameworkName: frameworkDetail?.name,
        frameworkDescription: frameworkDetail?.description,
    };
}

async function getPercentileResult(
    jobId: string,
    scores: JobApplicationScore[],
): Promise<CognitiveScoreWithType[]> {
    const validScoreTypes = [
        JobApplicationScoreType.REASONING_AVERAGE,
        JobApplicationScoreType.REASONING_LOGICAL,
        JobApplicationScoreType.REASONING_NUMERIC,
        JobApplicationScoreType.REASONING_VERBAL,
    ];

    const percentileScores = scores
        .filter((i) =>
            validScoreTypes.includes(i.score_type as JobApplicationScoreType),
        )
        .map(
            (i) =>
                <CognitiveScoreWithType>{
                    score: i.score! * 0.01,
                    score_type: i.score_type,
                    percentile: 0,
                },
        );

    if (percentileScores.length === 0) {
        return [];
    }

    return await computePersonPercentileScores(jobId, percentileScores);
}

async function prepareFileDownloads(
    jobApplicationId: string,
    displayName: string,
    attachmentFiles: { id: number; order_no: number }[],
    dataSource: DataSource,
    includeResume: boolean = true,
): Promise<FileDownload[]> {
    const fileDownload: FileDownload[] = [];

    if (includeResume) {
        const resumeFile = await dataSource
            .getRepository(JobApplicationResume)
            .findOne({
                where: {
                    job_application_id: jobApplicationId,
                    is_primary: true,
                },
            });

        if (resumeFile) {
            const resumeFilePath = getUrlFromDocumentBucket(
                resumeFile.file_path,
            );
            const resumeFileName = getResumeFileName(
                resumeFilePath,
                displayName,
            );
            fileDownload.push({
                file_path: resumeFilePath,
                file_name: resumeFileName,
            });
        }
    }

    if (attachmentFiles && attachmentFiles.length > 0) {
        const attachments = await dataSource
            .getRepository(JobApplicationAttachment)
            .find({
                select: ['id', 'file_name', 'file_path'],
                where: {
                    id: In(attachmentFiles.map((i) => i.id)),
                },
            });

        attachments.forEach((i) => {
            const attachmentFile = <FileDownload>{
                file_path: getUrlFromDocumentBucket(i.file_path),
                file_name: getAttachmentFileName(
                    i.file_path,
                    displayName,
                    attachmentFiles
                        .find((f) => f.id === i.id)
                        ?.order_no.toString() as string,
                ),
            };

            fileDownload.push(attachmentFile);
        });
    }

    return fileDownload;
}

function getContactInfo(
    jobApplication: JobApplication,
    includeContactInfo: boolean,
): ContactInfo {
    let contactEmail = '';
    let contactMobileNumber = '';
    let address = '';
    const displayName =
        `${jobApplication.first_name} ${jobApplication.last_name}`.trimEnd();

    if (includeContactInfo) {
        contactEmail = jobApplication.primary_contact_email;
        contactMobileNumber =
            jobApplication.contacts?.find(
                (i) =>
                    i.contact_type === ContactType.MOBILE &&
                    i.is_primary === true,
            )?.value || '';
        address = jobApplication.place_formatted_address;
    }

    return {
        displayName,
        contactEmail,
        contactMobileNumber,
        address,
    };
}

function getLatestPosition(careers: JobApplicationCareer[]): string | null {
    let latestCareer: JobApplicationCareer;
    const currentCareer = careers.find((v) => {
        return v.is_current;
    });

    if (currentCareer) {
        latestCareer = currentCareer;
    } else {
        const sortDescCareers = careers.sort((a, b) => {
            if (a.end_date && b.end_date) {
                return (
                    new Date(b.end_date).getTime() -
                    new Date(a.end_date).getTime()
                );
            }

            return -1;
        });

        latestCareer = sortDescCareers[0];
    }

    if (latestCareer) {
        return `${latestCareer.role} at ${latestCareer.organization}`;
    } else {
        return null;
    }
}

function getInterviewResponse(
    companyName: string,
    jobApplication: JobApplication,
    interviewRatings: InterviewRating[],
    includeInterviewReviews: boolean = true,
): InterviewResponseSummary | SafeAny {
    if (!includeInterviewReviews) {
        return {};
    }

    return {
        first_name: jobApplication.first_name,
        last_name: jobApplication.last_name,
        job_title: jobApplication.job?.title,
        company_name: companyName,
        interview_average_rating: jobApplication.average_rating,
        total_rating_submitted: jobApplication.total_rating_submitted,
        interview_response: interviewRatings.map((interviewRating) => {
            const questionsObject: Record<string, SafeAny> = {};

            interviewRating.rating_questions?.forEach((ratingQuestion) => {
                const key = (
                    ratingQuestion.interview_template_name ||
                    ratingQuestion.question_type
                )
                    .toLowerCase()
                    .split(' ')
                    .join('_');

                const dimensionLevel = getDimensionLevelByScore(
                    ratingQuestion.domain_score || 0,
                );

                if (!questionsObject[key]) {
                    questionsObject[key] = [];
                }

                questionsObject[key].push({
                    question_title: ratingQuestion.question_title,
                    question_content: ratingQuestion.question_contents,
                    answers: ratingQuestion.answer,
                    score: ratingQuestion.score,
                    note: ratingQuestion.note,
                    question_type: ratingQuestion.question_type,
                    interview_template_name:
                        ratingQuestion.interview_template_name,
                    dimension_level: dimensionLevel,
                });
            });

            return {
                score: interviewRating.score,
                note: interviewRating.note,
                submitted_at: interviewRating.submitted_at,
                respondent_name:
                    interviewRating.respondent_name ||
                    interviewRating.user_account_id,
                questions: questionsObject,
            };
        }),
    };
}

function prepareReasoningScore(
    jobApplicationScores: JobApplicationScore[],
    scoreType: JobApplicationScoreType,
): CognitiveScore | undefined {
    const reasoningOutcome = jobApplicationScores.find(
        (i) => i.score_type === scoreType,
    );

    if (!reasoningOutcome) {
        return undefined;
    }

    return {
        score: reasoningOutcome.score! * 0.01, //standard all score value as 2 decimal point format
        percentile: 0,
    };
}

async function computePersonPercentileScores(
    jobId: string,
    percentileScores: CognitiveScoreWithType[],
): Promise<CognitiveScoreWithType[]> {
    const dataSource = await getDataSource();
    const distributionScores = await dataSource
        .getRepository(JobDistributionScore)
        .find({
            select: ['score_type', 'alpha', 'beta'],
            where: {
                job_id: jobId,
            },
            cache: CacheTtl.ONE_MINUTE,
        });

    const paramsDict = keyBy(distributionScores, 'score_type');

    for (const score of percentileScores) {
        const { alpha, beta } = paramsDict[score.score_type!];
        score.percentile = numberUtil.roundDecimalPlace(
            cdf(score.score, alpha, beta),
            2,
        );
    }

    return percentileScores;
}

export const JobApplicationReportService = {
    prepareAssessmentReportSummary,
};
