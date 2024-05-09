import { generatorUtil } from '@pulsifi/fn';
import * as Factory from 'factory.ts';

import { AssessmentInviteOption, RoleFitModel } from '../../src/constants';
import { Job } from '../../src/models';
import { TestData } from '../setup';

export const testJobBuilder = Factory.Sync.makeFactory<Job>({
    id: generatorUtil.uuid(),
    company_id: 5,
    title: 'Tester',
    role: 'QA',
    status: 'active',
    employment_type: '',
    application_form: {
        resume: true,
        profile: true,
        work_experience: true,
        education: true,
        additional: false,
        review: true,
    },
    assessment_invite_option: AssessmentInviteOption.ALL,
    video_invite_option: 'all',
    is_video_deployed: true,
    role_fit_recipe_id: generatorUtil.uuid(),
    culture_fit_recipe_id: generatorUtil.uuid(),
    screening_questions: [],
    role_fit_model: RoleFitModel.DYNAMIC,
    created_by: TestData.createdBy,
    created_at: TestData.now,
    updated_by: TestData.createdBy,
    updated_at: TestData.now,
});
