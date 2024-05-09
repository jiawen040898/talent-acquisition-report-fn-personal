import { RiasecCodes } from '@pulsifi/descriptor-lib/types/common/enums/job-application-score-type.enum';
import {
    IngredientScore,
    PersonalityDomainScore,
} from '@pulsifi/descriptor-lib/types/common/interfaces';

import { JobApplicationSkillSource } from '../constants';

export interface CustomIngredientScore extends IngredientScore {
    ingredient_weighted_score?: number;
    display_score_rounding_adjustment?: number;
    display_weightage_rounding_adjustment?: number;
}

export interface PairwiseMatchDisplay {
    name: string;
    score?: number;
    match: boolean;
}
export interface PairwiseSkill {
    matches: PairwiseMatchSkill[];
    skill_name: string;
}

export interface PairwiseMatchSkill {
    score: number;
    skill_name: string;
    match: boolean;
    source?: JobApplicationSkillSource;
}

export interface PairwiseMatchTitleDisplay {
    name: string;
    score: number;
}

export interface PairwiseTitle {
    matches: PairwiseMatchTitle[];
    previous_employment: string;
}

export interface PairwiseMatchTitle {
    score: number;
    job_title: string;
}

export interface PersonalityTraitScore {
    trait_id: number;
    trait_alias: string;
    trait_name?: string;
    trait_order?: number;
    trait_score?: number;
    trait_weightage?: number;
    trait_framework?: string;
}

export interface ScoreOutcome {
    ingredient_result?: IngredientScore[] | null;
    personality_result?: PersonalityDomainScore[] | null;
    cognitive_result?: PersonalityDomainScore | null;
    pairwise_result?: PairwiseTitle[] | PairwiseSkill[] | null;
    framework_alias?: string | null;
    job_codes?: RiasecCodes[] | null;
    person_codes?: RiasecCodes[] | null;
}
