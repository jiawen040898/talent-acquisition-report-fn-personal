import {
    DateTimeColumn,
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

@Entity({ name: 'job_application_career' })
export class JobApplicationCareer extends AuditDataEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @UuidColumn()
    job_application_id!: string;

    @Column({
        length: 5000,
    })
    organization!: string;

    @Column({
        length: 5000,
    })
    role!: string;

    @Column()
    is_current!: boolean;

    @DateTimeColumn({
        nullable: true,
    })
    start_date?: Date;

    @DateTimeColumn({
        nullable: true,
    })
    end_date?: Date;

    /** @deprecated */ // TODO: To be removed after Sprint 65
    @Column({
        nullable: true,
    })
    description?: string;

    @Column({ type: 'text', nullable: true })
    responsibilities_achievements?: string | null;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    place_formatted_address?: string | null;

    @JsonColumn({
        nullable: true,
    })
    place_result?: JSON | null;

    @ManyToOne(() => JobApplication, (jobApplication) => jobApplication.careers)
    @JoinColumn({ name: 'job_application_id' })
    job_application?: JobApplication;
}
