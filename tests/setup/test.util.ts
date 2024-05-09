const mockUuid = (seed: number): string => {
    const indexToInsertDash = [8, 12, 16, 20];

    let result = '';
    [...String(seed).padStart(32, '0')].forEach((value, index) => {
        if (indexToInsertDash.includes(index)) {
            result += '-';
        }

        result += value;
    });

    return result;
};

export const testUtil = {
    mockUuid,
};
