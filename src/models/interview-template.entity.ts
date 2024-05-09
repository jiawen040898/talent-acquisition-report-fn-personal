import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { AuditDataEntity } from './audit-data.entity';
import { InterviewTemplateQuestion } from './interview-template-question.entity';

@Entity({ name: 'interview_template' })
export class InterviewTemplate extends AuditDataEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    company_id!: number;

    @Column({ length: 50 })
    name!: string;

    @OneToMany(
        () => InterviewTemplateQuestion,
        (templateQuestion) => templateQuestion.interview_template,
    )
    questions?: InterviewTemplateQuestion[];
}
