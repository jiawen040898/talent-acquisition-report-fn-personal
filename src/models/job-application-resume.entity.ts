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

@Entity({ name: 'job_application_resume' })
export class JobApplicationResume extends AuditDataEntity {
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

    @Column({
        length: 255,
    })
    original_file_path!: string;

    @Column({
        length: 255,
        nullable: true,
    })
    content_path?: string;

    @Column()
    is_primary!: boolean;

    @ManyToOne(() => JobApplication, (jobApplication) => jobApplication.resumes)
    @JoinColumn({ name: 'job_application_id' })
    job_application?: JobApplication;
}
