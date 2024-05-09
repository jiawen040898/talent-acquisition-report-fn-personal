import { JsonColumn } from '@pulsifi/fn/decorators/typeorm';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { AuditDataEntity } from './audit-data.entity';
import { Job } from './job.entity';

@Entity({ name: 'job_screening_question' })
export class JobScreeningQuestion extends AuditDataEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        nullable: false,
    })
    job_id!: string;

    @Column({
        nullable: false,
        length: 45,
    })
    alias!: string;

    @Column({
        nullable: false,
    })
    order_no!: number;

    @JsonColumn({
        nullable: false,
    })
    schema!: JSON;

    @JsonColumn({
        nullable: true,
    })
    rule?: JSON;

    @Column({
        nullable: true,
    })
    question_hash_code?: number;

    @Column({ default: false })
    is_filterable!: boolean;

    @ManyToOne(() => Job, (job) => job.screening_questions)
    @JoinColumn({ name: 'job_id' })
    job?: Job;
}
