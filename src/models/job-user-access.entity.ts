import { UuidColumn } from '@pulsifi/fn/decorators/typeorm';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { AuditDataEntity } from './audit-data.entity';
import { Job } from './job.entity';

@Entity({ name: 'job_user_access' })
export class JobUserAccess extends AuditDataEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @UuidColumn()
    job_id!: string;

    @Column()
    user_account_id!: number;

    @ManyToOne(() => Job, (job) => job.user_access)
    @JoinColumn({ name: 'job_id' })
    job?: Job;
}
