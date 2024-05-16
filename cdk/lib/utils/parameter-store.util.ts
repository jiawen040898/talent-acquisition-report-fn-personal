import { Construct } from 'constructs';

const resolveSSMArray = <T>(
    scope: Construct,
    array: T[],
): (T extends (...args: SafeAny) => infer P ? P : T)[] =>
    array.map((x) => {
        if (typeof x === 'function') {
            return x(scope);
        }
        return x;
    });

export const ParameterStoreUtil = {
    resolveSSMArray,
};
