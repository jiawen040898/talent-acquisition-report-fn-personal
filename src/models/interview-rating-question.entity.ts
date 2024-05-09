import {
    DecimalColumn,
    IntegerColumn,
    JsonColumn,
    UuidColumn,
} from '@pulsifi/fn/decorators/typeorm';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { InterviewQuestionType } from '../constants';
import {
    QuestionAnswer,
    QuestionContents,
    QuestionSchema,
    RatingScore,
} from '../interface';
import { AuditDataEntity } from './audit-data.entity';
import { InterviewRating } from './interview-rating.entity';

@Entity({ name: 'interview_rating_question' })
export class InterviewRatingQuestion extends AuditDataEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @UuidColumn()
    interview_rating_id!: string;

    @IntegerColumn({ nullable: true })
    interview_template_question_id?: number | null;

    @Column({ nullable: true, type: String })
    interview_template_name?: string | null;

    @Column({
        nullable: true,
        enum: InterviewQuestionType,
    })
    question_type!: InterviewQuestionType;

    @Column({ nullable: true, type: String })
    framework_alias?: string | null;

    @Column({ nullable: true, type: String })
    domain_alias?: string | null;

    @DecimalColumn({ nullable: true })
    domain_score?: number | null;

    @Column({ nullable: true, type: String })
    // Map from lib based on framework and domain alias
    domain_descriptor?: string | null;

    @Column({ nullable: true, type: String })
    // Static value from lib
    summary?: string | null;

    @IntegerColumn({ default: 0 })
    score!: RatingScore;

    @Column({ nullable: true, type: String })
    note?: string | null;

    @Column()
    // Snapshot during get started for L2,L3 and Job Custom Question Template
    question_title!: string;

    @JsonColumn()
    question_contents!: QuestionContents[];

    @JsonColumn({
        nullable: true,
    })
    question_schema?: QuestionSchema | null;

    @JsonColumn({
        nullable: true,
    })
    answer?: QuestionAnswer | null;

    @Column()
    order_no!: number;

    @Column({
        default: false,
    })
    is_deleted?: boolean;

    @ManyToOne(() => InterviewRating, (rating) => rating.rating_questions)
    @JoinColumn({ name: 'interview_rating_id' })
    template?: InterviewRating;
}
