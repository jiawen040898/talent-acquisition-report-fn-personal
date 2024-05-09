import { JsonColumn } from '@pulsifi/fn/decorators/typeorm';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RoleFitModel } from '../constants';
import { AuditDataEntity } from './audit-data.entity';
import { JobApplication } from './job-application.entity';
import { JobQuestionnaire } from './job-questionnaire.entity';
import { JobScreeningQuestion } from './job-screening-question.entity';
import { JobUserAccess } from './job-user-access.entity';

export interface VideoInterviewTemplateQuestion {
    title: string;
    max_tries: number;
    max_time: number;
    prep_time: number;
}

export interface VideoInterviewTemplate {
    questions: VideoInterviewTemplateQuestion[];
}

export interface ProfileForm {
    full_name: boolean;
    phone_number: boolean;
    address: boolean;
    nationality: boolean;
    source: boolean;
}
export interface ApplicationForm {
    resume: boolean;
    profile: boolean | ProfileForm;
    work_experience: boolean;
    education: boolean;
    additional: boolean;
    review: boolean;
}

@Entity({ name: 'job' })
export class Job extends AuditDataEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        length: 255,
    })
    title!: string;

    @Column({
        length: 255,
    })
    role!: string;

    @Column()
    company_id!: number;

    @Column({
        length: 150,
    })
    status!: string;

    @Column({
        length: 45,
    })
    employment_type!: string;

    @JsonColumn()
    application_form!: ApplicationForm;

    @Column({
        length: 100,
        default: 'all',
    })
    assessment_invite_option!: string;

    @Column({
        length: 100,
        default: 'all',
    })
    video_invite_option!: string;

    @Column({
        nullable: true,
        length: 30,
    })
    requisition_code?: string;

    @Column({
        nullable: true,
        length: 45,
    })
    external_id?: string;

    @Column({
        nullable: true,
    })
    description?: string;

    @Column({
        nullable: true,
    })
    place_formatted_address?: string;

    @JsonColumn({
        nullable: true,
        default: null,
    })
    place_result?: JSON;

    @JsonColumn({
        nullable: true,
        default: null,
    })
    skills?: JSON;

    @Column({
        nullable: true,
        length: 36,
    })
    role_fit_recipe_id?: string;

    @Column({
        nullable: true,
    })
    culture_fit_recipe_id?: string;

    @Column('date', {
        nullable: true,
    })
    posted_at?: Date;

    @Column('date', {
        nullable: true,
        name: 'expired_at',
    })
    expired_at?: Date;

    @Column({
        default: false,
    })
    is_video_deployed?: boolean;

    @Column({
        nullable: true,
    })
    ext_video_job_id?: number;

    @JsonColumn({
        nullable: true,
        default: null,
    })
    video_interview_template?: VideoInterviewTemplate;

    @Column({
        default: false,
    })
    is_deleted?: boolean;

    @Column({
        default: RoleFitModel.DYNAMIC,
        enum: RoleFitModel,
    })
    role_fit_model!: RoleFitModel;

    @OneToMany(() => JobScreeningQuestion, (question) => question.job)
    screening_questions?: JobScreeningQuestion[];

    @OneToMany(() => JobQuestionnaire, (questionnaire) => questionnaire.job, {
        cascade: ['insert'],
    })
    questionnaires?: JobQuestionnaire[];

    @OneToMany(() => JobApplication, (jobApplication) => jobApplication.job)
    job_applications?: JobApplication[];

    @OneToMany(() => JobUserAccess, (userAccess) => userAccess.job)
    user_access?: JobUserAccess[];
}
