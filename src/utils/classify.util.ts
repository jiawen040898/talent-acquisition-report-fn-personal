import { IngredientOutcome } from '@pulsifi/descriptor-lib/types/common/interfaces/personality.interface';

import { CustomIngredientOutcome } from '../interface';

export const classify = (list: IngredientOutcome[]) => {
    const cluster = (list: IngredientOutcome[]) => {
        const tol = 0.09;
        let customList: CustomIngredientOutcome[] = JSON.parse(
            JSON.stringify(list),
        );
        customList = customList.sort((x, y) => {
            if (!x.ingredient_weightage || !y.ingredient_weightage) {
                return 0;
            }
            return y.ingredient_weightage - x.ingredient_weightage;
        });
        let count = 1;
        let cluster = 1;
        let centroid = Number(customList[0].ingredient_weightage) || 0;
        customList[0].tag = cluster;
        for (const l of customList.slice(1)) {
            const val = Number(l.ingredient_weightage) || 0;
            if (Math.abs(val - centroid) < tol) {
                l.tag = cluster;
                centroid = (count * centroid + val) / (count + 1);
                count = count + 1;
            } else {
                cluster = cluster + 1;
                count = 1;
                l.tag = cluster;
                centroid = val;
            }
        }
        return customList;
    };

    const annotate = (customList: CustomIngredientOutcome[]) => {
        const nGroups = customList.slice(-1)[0].tag || 0;
        if (nGroups >= 2) {
            for (const x of customList) {
                if (x.tag === 1) {
                    x.annotate = 'very important';
                } else if (nGroups >= 3 && x.tag === 2) {
                    x.annotate = 'important';
                } else {
                    x.annotate = null;
                }
            }
        } else {
            for (const x of customList) {
                x.annotation = 'balance';
            }
        }
        return customList;
    };

    return annotate(cluster(list));
};
