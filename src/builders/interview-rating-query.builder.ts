import { Repository } from 'typeorm';

import { SortOrder } from '../constants';
import { InterviewRating } from '../models';
import { BaseQueryBuilder } from './base-query.builder';

export class InterviewRatingQueryBuilder extends BaseQueryBuilder<InterviewRating> {
    constructor(repository: Repository<InterviewRating>) {
        super(repository, 'interview_template');
    }

    leftJoinRatingQuestions(): InterviewRatingQueryBuilder {
        this.builder.leftJoinAndSelect(
            `${this.alias}.rating_questions`,
            'interview_rating_questions',
        );

        return this;
    }

    whereJobApplicationIs(
        jobApplicationId: string,
    ): InterviewRatingQueryBuilder {
        this.builder.andWhere(
            `${this.alias}.job_application_id = :job_application_id`,
            {
                job_application_id: jobApplicationId,
            },
        );

        return this;
    }

    orderByInterviewRatingQuestionOrderNo(): InterviewRatingQueryBuilder {
        this.builder.orderBy({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'interview_rating_questions.order_no': SortOrder.ASC,
        });
        return this;
    }

    whereSubmittedAt(): InterviewRatingQueryBuilder {
        this.builder.andWhere(`${this.alias}.submitted_at IS NOT NULL`);

        return this;
    }
}
