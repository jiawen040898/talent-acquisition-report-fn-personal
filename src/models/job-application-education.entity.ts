import {
    DateTimeColumn,
    DecimalColumn,
    IntegerColumn,
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

@Entity({ name: 'job_application_education' })
export class JobApplicationEducation extends AuditDataEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @UuidColumn()
    job_application_id!: string;

    @IntegerColumn()
    parent_id!: number;

    @Column({
        length: 255,
        nullable: true,
    })
    major_first?: string;

    @Column({
        length: 255,
        nullable: true,
    })
    major_second?: string;

    @Column({
        length: 150,
        nullable: true,
    })
    degree_name?: string;

    @Column({
        length: 255,
        nullable: true,
    })
    school_name?: string;

    @Column({
        length: 50,
        nullable: true,
    })
    grade_type?: string;

    @Column({
        length: 50,
        nullable: true,
    })
    grade_value?: string;

    @DecimalColumn({
        nullable: true,
    })
    grade_value_max?: number;

    @Column({
        length: 50,
        nullable: true,
    })
    grade_description?: string;

    @DateTimeColumn({
        nullable: true,
    })
    start_date?: Date;

    @DateTimeColumn({
        nullable: true,
    })
    end_date?: Date;

    @Column()
    is_highest!: boolean;

    /** @deprecated */ // TODO: To be removed after Sprint 65
    @Column({
        length: 500,
        nullable: true,
    })
    description?: string;

    @Column({
        length: 255,
        nullable: true,
    })
    others?: string;

    @DecimalColumn({
        nullable: true,
        precision: 3,
        scale: 2,
    })
    grade_cgpa?: number;

    @Column({ type: 'text', nullable: true })
    achievements?: string | null;

    @ManyToOne(
        () => JobApplication,
        (jobApplication) => jobApplication.educations,
    )
    @JoinColumn({ name: 'job_application_id' })
    job_application?: JobApplication;
}
