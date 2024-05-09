import {
    DateColumn,
    DecimalColumn,
    IntegerColumn,
    UuidColumn,
} from '@pulsifi/fn/decorators/typeorm';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { JobDistributionScoreType } from '../constants';
import { AuditDataEntity } from './audit-data.entity';

@Entity({ name: 'job_distribution_score' })
export class JobDistributionScore extends AuditDataEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @IntegerColumn()
    company_id!: number;

    @UuidColumn()
    job_id!: string;

    @Column({
        enum: JobDistributionScoreType,
    })
    score_type!: JobDistributionScoreType;

    @IntegerColumn()
    size!: number;

    @DecimalColumn({
        precision: 8,
    })
    mean!: number;

    @DecimalColumn({
        precision: 8,
    })
    variance!: number;

    @DecimalColumn({
        precision: 4,
    })
    alpha!: number;

    @DecimalColumn({
        precision: 4,
    })
    beta!: number;

    @DateColumn()
    version!: Date;
}
