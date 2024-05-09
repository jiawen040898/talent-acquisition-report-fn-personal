import { Repository } from 'typeorm';

import { Job, JobApplication, JobApplicationContact } from '../models';
import { BaseQueryBuilder } from './base-query.builder';

export class JobApplicationQueryBuilder extends BaseQueryBuilder<JobApplication> {
    readonly joinEntityAlias = {
        job: 'job',
        jobApp: 'app',
        jobAppQuestionnaire: 'job_app_questionnaire',
        jobAppResume: 'res',
        jobAppLbl: 'label',
    };

    company_id: number;

    constructor(repository: Repository<JobApplication>, companyId: number) {
        super(repository, 'app');

        this.company_id = companyId;
    }

    innerJoinJob(shouldMap = false): JobApplicationQueryBuilder {
        if (shouldMap) {
            this.builder.innerJoinAndMapOne(
                `${this.alias}.job`,
                Job,
                this.joinEntityAlias.job,
                `${this.alias}.job_id = ${this.joinEntityAlias.job}.id`,
            );
        } else {
            this.builder.innerJoin(
                `${this.alias}.job`,
                this.joinEntityAlias.job,
            );
        }

        return this;
    }

    leftJoinContacts(shouldMapMany = false): JobApplicationQueryBuilder {
        if (shouldMapMany) {
            this.builder.leftJoinAndMapMany(
                `${this.alias}.contacts`,
                JobApplicationContact,
                'con',
                `${this.alias}.id = con.job_application_id`,
            );
        } else {
            this.builder.leftJoin(`${this.alias}.contacts`, 'con');
        }

        return this;
    }

    selectDetailsForReport(): JobApplicationQueryBuilder {
        this.builder.select([
            'app.id',
            'app.job_id',
            'app.first_name',
            'app.last_name',
            'app.primary_contact_email',
            'app.nationality',
            'app.place_formatted_address',
            'app.source',
            'app.status',
            'app.skills',
            'app.professional_summary',
            'app.has_passed_screening',
            'app.total_questionnaires',
            'app.total_questionnaires_completed',
            'app.assessment_completed_at',
            'app.role_fit_score',
            'app.culture_fit_score',
            'app.average_rating',
            'app.total_rating_submitted',
            'job.id',
            'job.title',
            'job.role_fit_recipe_id',
            'job.culture_fit_recipe_id',
            'role_fit_model',
            'con.value',
            'con.is_primary',
            'con.contact_type',
        ]);

        return this;
    }

    whereJobApplicationIs(
        jobApplicationId: string,
    ): JobApplicationQueryBuilder {
        this.builder.andWhere(`${this.alias}.id = :job_application_id`, {
            job_application_id: jobApplicationId,
        });

        return this;
    }

    whereCompanyIs(companyId: number): JobApplicationQueryBuilder {
        this.builder.andWhere(`${this.alias}.company_id = :company_id`, {
            company_id: companyId,
        });

        return this;
    }
}
