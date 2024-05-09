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

@Entity({ name: 'job_application_action_history' })
export class JobApplicationActionHistory extends AuditDataEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @UuidColumn()
    job_application_id!: string;

    @UuidColumn()
    action_type!: string;

    @JsonColumn({
        nullable: true,
    })
    value?: JSON;

    @Column({
        length: 255,
    })
    created_username!: string;

    @ManyToOne(
        () => JobApplication,
        (jobApplication) => jobApplication.action_histories,
    )
    @JoinColumn({ name: 'job_application_id' })
    job_application?: JobApplication;
}
