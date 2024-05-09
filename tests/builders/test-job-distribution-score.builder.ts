import * as Factory from 'factory.ts';

import { JobDistributionScoreType } from '../../src/constants';
import { JobDistributionScore } from '../../src/models';
import { TestData, testUtil } from '../setup';

export const testJobDistributionScoreBuilder =
    Factory.Sync.makeFactory<JobDistributionScore>({
        id: Factory.each((i) => i + 1),
        company_id: TestData.companyId,
        job_id: Factory.each((i) => testUtil.mockUuid(i + 1)),
        score_type: JobDistributionScoreType.WORK_VALUE,
        size: 1680,
        mean: 0.69494606,
        variance: 0.03258286,
        alpha: 3.8266,
        beta: 1.6797,
        version: new Date('2022-02-01'),
        ...TestData.auditData,
    });
