import { UuidColumn } from '@pulsifi/fn/decorators/typeorm';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { AuditDataEntity } from './audit-data.entity';
import { JobApplication } from './job-application.entity';

@Entity({ name: 'job_application_label' })
export class JobApplicationLabel extends AuditDataEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    company_id!: number;

    @UuidColumn()
    job_application_id!: string;

    @Column({
        length: 255,
    })
    value!: string;

    @ManyToOne(
        () => JobApplication,
        (jobApplication) => jobApplication.screening_answers,
    )
    @JoinColumn({ name: 'job_application_id' })
    job_application?: JobApplication;
}
