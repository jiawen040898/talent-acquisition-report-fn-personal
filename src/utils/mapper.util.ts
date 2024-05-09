import {
    getDescriptorSummary,
    getDimensionLevelByScore,
    JobApplicationScoreType,
    mapPersonalityScoreWithDescriptor,
    mapWorkInterestDescriptors,
} from '@pulsifi/descriptor-lib';
import { MapperTypeParams } from '@pulsifi/descriptor-lib/types/common/enums';
import {
    DescriptorSummary,
    IngredientScore,
    PersonalityDomainScore,
    PersonalityOutcome,
} from '@pulsifi/descriptor-lib/types/common/interfaces';
import { DEFAULT_LOCALE, numberUtil } from '@pulsifi/fn';

import {
    INGREDIENT_SCORE_AND_WEIGHTAGE_ADJUSTMENT_STEPS,
    RoleFitModel,
} from '../constants';
import { FitScoreRecipe } from '../dtos';
import {
    CognitiveScoreWithType,
    CustomIngredientScore,
    PairwiseMatchDisplay,
    PairwiseMatchTitleDisplay,
    PairwiseSkill,
    PairwiseTitle,
    PersonalityFrameworkDetails,
    ScoreOutcome,
} from '../interface';
import { Job, JobApplicationCareer, JobApplicationScore } from '../models';
import { NumberDistributionUtils } from './number-distribution.util';

function sortPairwiseScore(
    pairwiseResult: PairwiseMatchDisplay[] | PairwiseMatchTitleDisplay[],
) {
    return pairwiseResult.sort(
        (a, b) => (b?.score as number) - (a?.score as number),
    );
}

export function toPairwiseDisplay(
    pairwiseSkills: PairwiseSkill[],
): PairwiseMatchDisplay[] {
    const pairwiseMatchResult: PairwiseMatchDisplay[] = [];

    pairwiseSkills.forEach((s) => {
        s.matches.forEach((m) => {
            const foundSkill = pairwiseMatchResult.find(
                (i) => i.name == m.skill_name,
            );
            if (foundSkill) {
                if (m.match) {
                    foundSkill.match = m.match;
                }
            } else {
                pairwiseMatchResult.push({
                    name: m.skill_name,
                    score: m.score,
                    match: m.match,
                });
            }
        });
    });

    return sortPairwiseScore(pairwiseMatchResult) as PairwiseMatchDisplay[];
}

export function getPairwiseMatchTitleDisplay(
    pairwiseResult: PairwiseTitle[],
): PairwiseMatchTitleDisplay[] {
    const pairwiseMatchResult: PairwiseMatchTitleDisplay[] = [];

    pairwiseResult.forEach((title) => {
        title.matches.forEach((match) => {
            pairwiseMatchResult.push({
                name: title.previous_employment,
                score: match.score,
            });
        });
    });

    return sortPairwiseScore(
        pairwiseMatchResult,
    ) as PairwiseMatchTitleDisplay[];
}

export function getScoreValueByType(
    scores: JobApplicationScore[],
    scoreType: JobApplicationScoreType,
): number | undefined {
    return getScoreByType(scores, scoreType)?.score || undefined;
}

export function getScoreByType(
    scores: JobApplicationScore[],
    scoreType: JobApplicationScoreType,
): JobApplicationScore | undefined {
    return scores.find((i) => i.score_type === scoreType);
}

export function getPersonalityDescriptorWithSummary(
    scores: JobApplicationScore[],
    firstName: string,
    language?: string,
): {
    workInterest: PersonalityDomainScore[];
    workStyle: PersonalityDomainScore[];
    workValue: PersonalityDomainScore[];
    assessmentOverview: DescriptorSummary;
} {
    const workInterest = getPersonalityResultWithDescriptor(
        scores,
        JobApplicationScoreType.WORK_INTEREST,
        firstName,
        language,
    ) as PersonalityOutcome[];

    const workStyle = getPersonalityResultWithDescriptor(
        scores,
        JobApplicationScoreType.WORK_STYLE,
        firstName,
        language,
    ) as PersonalityOutcome[];

    const workValue = getPersonalityResultWithDescriptor(
        scores,
        JobApplicationScoreType.WORK_VALUE,
        firstName,
        language,
    ) as PersonalityOutcome[];

    const assessmentOverview = getDescriptorSummary(
        {
            work_interest: workInterest,
            work_style: workStyle,
            work_value: workValue,
        },
        {
            name: firstName,
            locale: language,
        },
    ) as DescriptorSummary;

    limitDescriptorOverviewContent(assessmentOverview);

    return {
        workInterest,
        workStyle,
        workValue,
        assessmentOverview,
    };
}

export function getCultureFitBreakdown(
    scores: JobApplicationScore[],
    frameworkDetail: PersonalityFrameworkDetails,
): PersonalityDomainScore[] {
    const cultureFitResult: PersonalityDomainScore[] = [];
    const cultureFitScores = getPersonalityResult(
        scores,
        JobApplicationScoreType.CULTURE_FIT,
    );

    if (cultureFitScores) {
        frameworkDetail.framework_recipes.forEach((frameworkRecipeItem) => {
            const foundCultureFitScoreItem = cultureFitScores.find(
                (i) => i.domain_alias === frameworkRecipeItem.alias,
            );
            if (foundCultureFitScoreItem) {
                foundCultureFitScoreItem.descriptor =
                    frameworkRecipeItem.description;
                foundCultureFitScoreItem.domain_name = frameworkRecipeItem.name;
                foundCultureFitScoreItem.dimension_level =
                    getDimensionLevelByScore(
                        foundCultureFitScoreItem.domain_score as number,
                    );
                cultureFitResult.push(foundCultureFitScoreItem);
            }
        });
    }
    return cultureFitResult;
}

export function getRoleFitBreakdown(
    job: Job,
    scores: JobApplicationScore[],
    jobRecipes: FitScoreRecipe[],
): CustomIngredientScore[] {
    let roleFitResult: CustomIngredientScore[] | undefined;
    if (job.role_fit_model === RoleFitModel.NONE) {
        return [];
    }

    const roleFitOutcome = getScoreOutcomeByType(
        scores,
        JobApplicationScoreType.ROLE_FIT,
    );

    let ingredientResult: CustomIngredientScore[] =
        roleFitOutcome?.ingredient_result ?? [];

    if (!ingredientResult.length) {
        roleFitResult = jobRecipes
            .filter((i) => i.ingredient_group === 'recipe')
            .map(
                (i) => <CustomIngredientScore>(<unknown>{
                        ingredient_score: null,
                        ingredient_alias: i.ingredient_alias,
                        ingredient_weightage: i.weightage,
                        ingredient_weighted_score: null,
                    }),
            );

        return prepareRoleFitBreakdown(scores, roleFitResult);
    }

    const hasRoundingAdjustmentKey = ingredientResult.some((i) =>
        i.hasOwnProperty('display_score_rounding_adjustment'),
    );

    if (!hasRoundingAdjustmentKey) {
        ingredientResult =
            NumberDistributionUtils.distributeRoleFitIngredientScore(
                ingredientResult,
                INGREDIENT_SCORE_AND_WEIGHTAGE_ADJUSTMENT_STEPS,
            );
    }

    roleFitResult = ingredientResult.map((i) => {
        const weightageAdjustment =
            i.display_weightage_rounding_adjustment ?? 0;
        const scoreAdjustment = i.display_score_rounding_adjustment ?? 0;

        const adjustedIngredientWeightage = numberUtil.roundDecimalPlace(
            (i.ingredient_weightage ?? 0) + weightageAdjustment,
            2,
        );
        const adjustedIngredientWeightedScore = numberUtil.roundDecimalPlace(
            (i.ingredient_weightage ?? 0) * (i.ingredient_score ?? 0) +
                scoreAdjustment,
            2,
        );

        const {
            // eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/no-unused-vars,no-unused-vars
            display_score_rounding_adjustment,
            // eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/no-unused-vars,no-unused-vars
            display_weightage_rounding_adjustment,
            ...rest
        } = i;

        return {
            ...rest,
            ingredient_weightage: adjustedIngredientWeightage,
            ingredient_weighted_score: adjustedIngredientWeightedScore,
        };
    });

    return prepareRoleFitBreakdown(scores, roleFitResult);
}

export function getScoreOutcomeByType(
    scores: JobApplicationScore[],
    scoreType: JobApplicationScoreType,
): ScoreOutcome | undefined {
    return (
        (scores.find((i) => i.score_type === scoreType)
            ?.score_outcome as ScoreOutcome) || undefined
    );
}

// reasoning score must X 0.01 because we store in DB max 0-100
export function getRemappedCognitiveScoreToOne(
    score: CognitiveScoreWithType,
): CognitiveScoreWithType {
    return {
        score_type: score.score_type,
        score: score.score * 0.01,
        percentile: score.percentile,
    };
}

/**
 *
 sum up 3 x cognitive weightage
 remove any 3 x cognitive
 get reason average score value when any 3 x cognitive was found
 add reason ingredient to the list with score , sum up weight value when any 3 x cognitive was found
 sort by weight (highest to lowest)
 [2022-03-24] change to average weightage to have balance crown indicator
 * @param scores
 * @param roleFitResult
 * @returns
 */
function prepareRoleFitBreakdown(
    scores: JobApplicationScore[],
    roleFitResult: CustomIngredientScore[],
): IngredientScore[] {
    const roleFitBreakdowns: IngredientScore[] = [];
    let cognitiveAccCount = 0;
    const reasoningAverageWeight = roleFitResult.reduce((acc, cur) => {
        if (
            cur.ingredient_alias === JobApplicationScoreType.REASONING_VERBAL ||
            cur.ingredient_alias ===
                JobApplicationScoreType.REASONING_LOGICAL ||
            cur.ingredient_alias === JobApplicationScoreType.REASONING_NUMERIC
        ) {
            acc += cur.ingredient_weightage ?? 0;
            cognitiveAccCount++;
        }

        roleFitBreakdowns.push(cur);

        return acc;
    }, 0);

    let reasoningAverageScore =
        getScoreValueByType(
            scores,
            JobApplicationScoreType.REASONING_AVERAGE,
        ) || null;

    if (reasoningAverageScore) {
        reasoningAverageScore = reasoningAverageScore * 0.01; //score value was stored as 100%
    }

    roleFitBreakdowns.push(<CustomIngredientScore>{
        ingredient_score: reasoningAverageScore,
        ingredient_alias: JobApplicationScoreType.REASONING_AVERAGE,
        ingredient_weightage: reasoningAverageWeight / cognitiveAccCount,
    });

    roleFitBreakdowns.sort(
        (a, b) => (b.ingredient_weightage ?? 0) - (a.ingredient_weightage ?? 0),
    );

    return roleFitBreakdowns;
}

export function getLatestPosition(
    careers: JobApplicationCareer[],
): string | null {
    let latestCareer: JobApplicationCareer;
    const currentCareer = careers.find((v) => {
        return v.is_current;
    });

    if (currentCareer) {
        latestCareer = currentCareer;
    } else {
        const sortDescCareers = careers.sort((a, b) => {
            if (a.end_date && b.end_date) {
                return (
                    new Date(b.end_date).getTime() -
                    new Date(a.end_date).getTime()
                );
            }

            return -1;
        });

        latestCareer = sortDescCareers[0];
    }

    return latestCareer
        ? `${latestCareer.role} at ${latestCareer.organization}`
        : null;
}

function getPersonalityResultWithDescriptor(
    scores: JobApplicationScore[],
    scoreType: MapperTypeParams,
    firstName: string,
    language = DEFAULT_LOCALE,
): PersonalityOutcome[] | null {
    let personalityResult = [];
    const personalityOutcome = getScoreOutcomeByType(
        scores,
        scoreType,
    ) as ScoreOutcome;

    if (!personalityOutcome) {
        return [];
    }

    if (scoreType === JobApplicationScoreType.WORK_INTEREST) {
        personalityResult =
            mapWorkInterestDescriptors(
                personalityOutcome.personality_result ?? [],
                personalityOutcome.person_codes ?? [],
                personalityOutcome.job_codes ?? [],
                {
                    name: firstName,
                    locale: language,
                },
            ) ?? [];
    } else {
        personalityResult = mapPersonalityScoreWithDescriptor(
            personalityOutcome.personality_result ?? [],
            scoreType,
            {
                name: firstName,
                locale: language,
            },
        );
    }

    return personalityResult;
}

function getPersonalityResult(
    jobApplicationScores: JobApplicationScore[],
    scoreType: JobApplicationScoreType,
): PersonalityOutcome[] | null {
    const personalityOutcome = jobApplicationScores.find(
        (i) => i.score_type === scoreType,
    )?.score_outcome as ScoreOutcome;

    return personalityOutcome?.personality_result ?? null;
}

function limitDescriptorOverviewContent(summary: DescriptorSummary) {
    summary.thrive = summary.thrive?.slice(0, 3);
    summary.working_with = summary.working_with?.slice(0, 3);
    summary.watch_out = summary.watch_out?.slice(0, 5);
}
