import {
    DecimalColumn,
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

import { AuditDataEntity } from './audit-data.entity';
import { JobApplication } from './job-application.entity';

@Entity({ name: 'job_application_score' })
export class JobApplicationScore extends AuditDataEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @UuidColumn()
    job_application_id!: string;

    @UuidColumn({
        nullable: true,
    })
    score_recipe_id?: string;

    @JsonColumn({
        nullable: true,
    })
    score_outcome?: JSON;

    @Column({
        length: 100,
    })
    score_type!: string;

    @Column({
        type: 'smallint',
    })
    score_dimension!: number;

    @DecimalColumn({
        precision: 7,
        nullable: true,
    })
    score?: number;

    @DecimalColumn({
        precision: 7,
        nullable: true,
    })
    percentile?: number;

    @Column({
        length: 100,
        nullable: true,
    })
    percentile_source?: string;

    @Column({
        length: 10,
        nullable: true,
    })
    percentile_api_version?: string;

    @ManyToOne(() => JobApplication, (jobApplication) => jobApplication.scores)
    @JoinColumn({ name: 'job_application_id' })
    job_application?: JobApplication;
}
