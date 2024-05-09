import { numberUtil } from '@pulsifi/fn';
import { sumBy } from 'lodash';

import { TOTAL_INGREDIENT_WEIGHTAGE } from '../constants';
import { CustomIngredientScore } from '../interface';

type Prettify<T> = {
    [K in keyof T]: T[K];
} & unknown;

type DistributedData<T extends object, K extends string> = Prettify<
    T & { [P in K]: number }
>;

type DataWithAssignRoundedNumberAndRoundingDifferences<T extends object> = T & {
    roundedNumber: number;
    differences: number;
    maxScore?: number;
};

/**
 * @example
 * const num = 0.05;
 * getDecimalPlace(num) // 2
 */
const getDecimalPlace = (num: number) =>
    num.toString().split('.')[1]?.length ?? 0;

const assignRoundedNumberAndRoundingDifferences = <T extends object>(
    dataToBeDistributed: T[],
    keyOfScoreToRoundAndFindDifference: keyof T,
    decimalPlace: number,
    maxScoreKey?: keyof T,
    maxScoreAdjustmentKey?: keyof T,
): DataWithAssignRoundedNumberAndRoundingDifferences<T>[] => {
    return dataToBeDistributed.map((data) => {
        const number = data[keyOfScoreToRoundAndFindDifference] as number;
        const roundedNumber = numberUtil.roundDecimalPlace(
            number,
            decimalPlace,
        );

        let maxScore: number | undefined;
        if (maxScoreKey && maxScoreAdjustmentKey) {
            const roundedMaxScore = numberUtil.roundDecimalPlace(
                data[maxScoreKey] as number,
                decimalPlace,
            );

            maxScore = numberUtil.roundDecimalPlace(
                roundedMaxScore +
                    ((data[maxScoreAdjustmentKey] ?? 0) as number),
                decimalPlace,
            );
        }
        const differences = roundedNumber - number;

        return {
            ...data,
            roundedNumber,
            maxScore,
            differences,
        };
    });
};

const getNumberOfStepsFromDifferences = (
    differencesFromTargetValue: number,
    step: number,
): number => {
    return Math.abs(Math.floor(differencesFromTargetValue / step));
};

const getNumberDifferencesFromTargetValue = <T extends object>(
    dataToBeDistributed: DataWithAssignRoundedNumberAndRoundingDifferences<T>[],
    decimalPlace: number,
    roundedTargetValueToMatch: number,
): number => {
    const sumOfNumbersToBeDistributed = sumBy(
        dataToBeDistributed,
        (obj) => obj.roundedNumber,
    );

    return numberUtil.roundDecimalPlace(
        roundedTargetValueToMatch - sumOfNumbersToBeDistributed,
        decimalPlace,
    );
};

const getSortedDataToBeDistributed = <T extends object>(
    dataWithRounded: DataWithAssignRoundedNumberAndRoundingDifferences<T>[],
    isIncrement: boolean,
) => {
    return dataWithRounded.sort((a, b) => {
        if (isIncrement) {
            /* sort smallest to biggest */
            return a.differences - b.differences;
        } else {
            /* sort biggest to smallest */
            return b.differences - a.differences;
        }
    });
};

const getDataWithRoundingAdjustment = <T extends object, K extends string>(
    dataWithRoundedNumberAndDifferences: DataWithAssignRoundedNumberAndRoundingDifferences<T>[],
    numberOfSteps: number,
    assignedKey: K,
    step: number,
    isIncrement: boolean,
): DistributedData<T, K>[] => {
    const output: DistributedData<T, K>[] = [];

    /* find any data that have the score more than its maxScore */
    const maxScoreExceededData = dataWithRoundedNumberAndDifferences.filter(
        (data) => {
            return data.maxScore && data.roundedNumber > data.maxScore;
        },
    );

    const nonScoreExceedData = dataWithRoundedNumberAndDifferences.filter(
        (data) => {
            return !data.maxScore || data.roundedNumber <= data.maxScore;
        },
    );

    /**
     * assign minus step for each exceeded max score data
     * so that it is equal to max score
     *
     * example:
     * target score: 0.52
     * calculated difference is 0.53 (at here we need 1 step to decrement)
     * isIncrement = false
     * numberOfSteps = 1
     *
     * weightage: 0.10 score: 0.107 // <-- score exceeded weightage(maxScore)
     * weightage: 0.09 score: 0.104 // <-- score exceeded weightage(maxScore)
     * weightage: 0.15 score: 0.015
     * weightage: 0.66 score: 0.301
     *
     * so numberOfSteps here will be -1, because maxScoreExceededData will minus twice on numberOfSteps
     */
    maxScoreExceededData.forEach((data) => {
        const distributedData = {
            ...data,
            [assignedKey]: -step,
        };

        /**
         * since we did a decrement, we need to balance it out from the rest of the data,
         * we need to based on isIncrement value to decrease or increase on numberOfSteps
         */
        isIncrement ? numberOfSteps++ : numberOfSteps--;
        output.push(distributedData as DistributedData<T, K>);
    });

    /**
     * if numberOfSteps is negative, we will require to do the opposite action to increase back the over deducted value
     * e.g. decrement to increment
     */
    if (numberOfSteps < 0) {
        isIncrement = !isIncrement;
        numberOfSteps = Math.abs(numberOfSteps);
    }

    const sortedNonScoreExceedData = getSortedDataToBeDistributed(
        nonScoreExceedData,
        isIncrement,
    );

    const distributedNumbers = sortedNonScoreExceedData.map(
        (distributionNumber) => {
            const {
                // eslint-disable-next-line
                differences,
                roundedNumber,
                maxScore,
                ...distributedData
            } = distributionNumber;

            const shouldNotIncrement = maxScore && roundedNumber >= maxScore;

            const shouldDistributeNumber =
                numberOfSteps && !(isIncrement && shouldNotIncrement);

            if (shouldDistributeNumber) {
                --numberOfSteps;
                return {
                    ...distributedData,
                    [assignedKey]: isIncrement ? step : -step,
                };
            }

            return {
                ...distributedData,
                [assignedKey]: 0,
            };
        },
    ) as unknown as DistributedData<T, K>[];

    output.push(...distributedNumbers);

    return output;
};

const distributeNumbersToMatchTargetValue = <
    T extends object,
    K extends string,
>(
    targetValueToMatch: number,
    dataToBeDistributed: T[],
    keyOfData: keyof T,
    assignedKey: K,
    step: number,
    maxScoreKey?: keyof T,
    maxScoreAdjustmentKey?: keyof T,
): DistributedData<T, K>[] => {
    const decimalPlace = getDecimalPlace(step);
    const roundedTargetValueToMatch = numberUtil.roundDecimalPlace(
        targetValueToMatch,
        decimalPlace,
    );

    const dataWithRoundedNumberAndDifferences =
        assignRoundedNumberAndRoundingDifferences(
            dataToBeDistributed,
            keyOfData,
            decimalPlace,
            maxScoreKey,
            maxScoreAdjustmentKey,
        );

    const numberDifferencesFromTargetValue =
        getNumberDifferencesFromTargetValue(
            dataWithRoundedNumberAndDifferences,
            decimalPlace,
            roundedTargetValueToMatch,
        );

    const numberOfSteps = getNumberOfStepsFromDifferences(
        numberDifferencesFromTargetValue,
        step,
    );

    const isIncrement = numberDifferencesFromTargetValue > 0;

    return getDataWithRoundingAdjustment(
        dataWithRoundedNumberAndDifferences,
        numberOfSteps,
        assignedKey,
        step,
        isIncrement,
    );
};

const distributeRoleFitIngredientScore = (
    dataToBeDistributed: CustomIngredientScore[],
    step: number,
) => {
    const distributedIngredientScoresByWeightage =
        distributeNumbersToMatchTargetValue(
            TOTAL_INGREDIENT_WEIGHTAGE,
            dataToBeDistributed,
            'ingredient_weightage',
            'display_weightage_rounding_adjustment',
            step,
        );

    const ingredientScoresWithWeightedScore =
        distributedIngredientScoresByWeightage.map((score) => {
            return {
                ...score,
                ingredient_weighted_score:
                    (score.ingredient_score ?? 0) *
                    (score.ingredient_weightage ?? 0),
            };
        });

    const totalScore = sumBy(
        dataToBeDistributed,
        (x) => (x.ingredient_score ?? 0) * (x.ingredient_weightage ?? 0),
    );

    return distributeNumbersToMatchTargetValue(
        totalScore,
        ingredientScoresWithWeightedScore,
        'ingredient_weighted_score',
        'display_score_rounding_adjustment',
        step,
        'ingredient_weightage',
        'display_weightage_rounding_adjustment',
    );
};

export const NumberDistributionUtils = {
    distributeNumbersToMatchTargetValue,
    distributeRoleFitIngredientScore,
};
