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

@Entity({ name: 'job_application_attachment' })
export class JobApplicationAttachment extends AuditDataEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @UuidColumn()
    job_application_id!: string;

    @Column({
        length: 255,
    })
    file_name!: string;

    @Column({
        length: 255,
    })
    file_path!: string;

    @ManyToOne(
        () => JobApplication,
        (jobApplication) => jobApplication.attachments,
    )
    @JoinColumn({ name: 'job_application_id' })
    job_application?: JobApplication;
}
