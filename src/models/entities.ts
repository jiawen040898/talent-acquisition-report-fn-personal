import { InterviewRating } from './interview-rating.entity';
import { InterviewRatingQuestion } from './interview-rating-question.entity';
import { InterviewTemplate } from './interview-template.entity';
import { InterviewTemplateQuestion } from './interview-template-question.entity';
import { Job } from './job.entity';
import { JobApplication } from './job-application.entity';
import { JobApplicationActionHistory } from './job-application-action-history.entity';
import { JobApplicationAttachment } from './job-application-attachment.entity';
import { JobApplicationCareer } from './job-application-career.entity';
import { JobApplicationContact } from './job-application-contact.entity';
import { JobApplicationEducation } from './job-application-education.entity';
import { JobApplicationLabel } from './job-application-label.entity';
import { JobApplicationQuestionnaire } from './job-application-questionnaire.entity';
import { JobApplicationResume } from './job-application-resume.entity';
import { JobApplicationScore } from './job-application-score.entity';
import { JobApplicationScreeningAnswer } from './job-application-screening-answer.entity';
import { JobDistributionScore } from './job-distribution-score.entity';
import { JobQuestionnaire } from './job-questionnaire.entity';
import { JobScreeningQuestion } from './job-screening-question.entity';
import { JobUserAccess } from './job-user-access.entity';

export const ENTITIES = [
    Job,
    JobApplication,
    JobApplicationActionHistory,
    JobApplicationAttachment,
    JobApplicationCareer,
    JobApplicationContact,
    JobApplicationEducation,
    JobApplicationLabel,
    JobApplicationQuestionnaire,
    JobApplicationResume,
    JobApplicationScore,
    JobApplicationScreeningAnswer,
    JobScreeningQuestion,
    JobQuestionnaire,
    JobUserAccess,
    InterviewRating,
    InterviewRatingQuestion,
    InterviewTemplate,
    InterviewTemplateQuestion,
    JobDistributionScore,
];
