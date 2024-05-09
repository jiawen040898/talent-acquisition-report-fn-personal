import {
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

import { QuestionSchema } from '../interface';
import { AuditDataEntity, InterviewTemplate } from '.';

@Entity({ name: 'interview_template_question' })
export class InterviewTemplateQuestion extends AuditDataEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @UuidColumn()
    interview_template_id!: string;

    @Column()
    title!: string;

    @Column({
        nullable: true,
        type: String,
    })
    content?: string | null;

    @Column('text', {
        array: true,
    })
    additional!: string[];

    @IntegerColumn()
    order_no!: number;

    @JsonColumn({
        nullable: true,
    })
    question_schema?: QuestionSchema;

    @ManyToOne(() => InterviewTemplate, (template) => template.questions)
    @JoinColumn({ name: 'interview_template_id' })
    interview_template?: InterviewTemplate;
}
