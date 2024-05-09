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

@Entity({ name: 'job_questionnaire' })
export class JobQuestionnaire extends AuditDataEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @UuidColumn({
        nullable: false,
    })
    job_id!: string;

    @Column({
        length: 100,
    })
    questionnaire_framework!: string;

    @Column()
    questionnaire_id!: number;

    @Column({
        length: 255,
        default: 'en',
    })
    language!: string;

    @ManyToOne(() => Job, (job) => job.questionnaires)
    @JoinColumn({ name: 'job_id' })
    job?: Job;
}
