import { UuidColumn } from '@pulsifi/fn/decorators/typeorm';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { ContactType } from '../constants';
import { AuditDataEntity } from './audit-data.entity';
import { JobApplication } from './job-application.entity';

@Entity({ name: 'job_application_contact' })
export class JobApplicationContact extends AuditDataEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @UuidColumn()
    job_application_id!: string;

    @Column({
        enum: ContactType,
        length: 20,
    })
    contact_type!: string;

    @Column({
        length: 5000,
    })
    value!: string;

    @Column()
    is_primary!: boolean;

    @ManyToOne(
        () => JobApplication,
        (jobApplication) => jobApplication.contacts,
    )
    @JoinColumn({ name: 'job_application_id' })
    job_application?: JobApplication;
}
