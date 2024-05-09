import {
    IntegerColumn,
    JsonColumn,
    UuidColumn,
} from '@pulsifi/fn/decorators/typeorm';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { InterviewRatingStatus } from '../constants';
import { RatingCompetency, RatingScore } from '../interface';
import { AuditDataEntity } from './audit-data.entity';
import { InterviewRatingQuestion } from './interview-rating-question.entity';

@Entity({ name: 'interview_rating' })
export class InterviewRating extends AuditDataEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @UuidColumn()
    job_application_id?: string | null;

    @IntegerColumn({ nullable: true })
    user_account_id!: number | null;

    @Column({ nullable: true, type: String })
    fingerprint_id!: string | null;

    @Column({ nullable: true, type: String })
    job_application_share_id?: string | null;

    @Column({
        default: InterviewRatingStatus.PENDING,
        enum: InterviewRatingStatus,
    })
    status!: InterviewRatingStatus;

    @IntegerColumn({
        default: null,
        nullable: true,
    })
    score?: RatingScore | null;

    @Column({ nullable: true, type: String, length: 500 })
    note?: string | null;

    @JsonColumn({ nullable: true })
    competencies!: RatingCompetency[] | [];

    @Column({ nullable: true, type: Date })
    submitted_at?: Date | null;

    @Column({ nullable: true, type: String })
    respondent_name?: string | null;

    @Column({
        default: false,
    })
    is_deleted?: boolean;

    @OneToMany(
        () => InterviewRatingQuestion,
        (ratingQuestion) => ratingQuestion.template,
    )
    rating_questions?: InterviewRatingQuestion[];
}
