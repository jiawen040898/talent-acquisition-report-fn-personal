import { JsonColumn, UuidColumn } from '@pulsifi/fn/decorators/typeorm';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { AuditDataEntity } from './audit-data.entity';
import { JobApplication } from './job-application.entity';

@Entity({ name: 'job_application_questionnaire' })
export class JobApplicationQuestionnaire extends AuditDataEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @UuidColumn()
    job_application_id!: string;

    @Column({
        length: 100,
    })
    questionnaire_framework!: string;

    @Column()
    questionnaire_id!: number;

    @Column({
        nullable: true,
    })
    started_at?: Date;

    @Column({
        nullable: true,
    })
    completed_at?: Date;

    @Column()
    attempts!: number;

    @JsonColumn({
        nullable: true,
    })
    question_answer_raw?: JSON;

    @JsonColumn({
        nullable: true,
    })
    result_raw?: JSON;

    @ManyToOne(
        () => JobApplication,
        (jobApplication) => jobApplication.questionnaires,
    )
    @JoinColumn({ name: 'job_application_id' })
    job_application?: JobApplication;
}
