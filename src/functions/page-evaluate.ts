import { AssessmentScoreSummary } from '../interface';

export const evaluate = () => {
    const { Bar, Radar } = (window as SafeAny).G2Plot;
    const assessmentScores: AssessmentScoreSummary = (window as SafeAny)
        .assessment_scores;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { culture_fit, work_style, work_interest, work_value } =
        assessmentScores;

    const convertScore = (score: SafeAny) => {
        return Math.ceil(score * 100);
    };

    if (culture_fit?.length) {
        const cultureFitData = culture_fit.map((w) => ({
            ...w,
            domain_score: convertScore(w.domain_score),
        }));
        const cultureFitEl = document.getElementById('culture_fit');
        if (cultureFitEl instanceof HTMLElement) {
            const cultureFitRadar = new Radar(
                cultureFitEl,
                (window as SafeAny).radarOptions(cultureFitData),
            );
            cultureFitRadar.render();
        }
    }

    if (work_style?.length) {
        const workStyleData = work_style.map((w) => ({
            ...w,
            domain_score: convertScore(w.domain_score),
        }));
        const workStyleEl = document.getElementById('work_style');
        if (workStyleEl instanceof HTMLElement) {
            const workStyleBar = new Bar(
                workStyleEl,
                (window as SafeAny).barOptions(workStyleData),
            );
            workStyleBar.render();
        }
    }

    if (work_interest?.length) {
        const workInterestData = work_interest.map((w) => ({
            ...w,
            domain_score: convertScore(w.domain_score),
        }));
        const workInterestsEl = document.getElementById('work_interest');
        if (workInterestsEl instanceof HTMLElement) {
            const workInterestsRadar = new Radar(
                workInterestsEl,
                (window as SafeAny).radarOptions(workInterestData),
            );
            workInterestsRadar.render();
        }
    }

    if (work_value?.length) {
        const workValueData = work_value.map((w) => ({
            ...w,
            domain_score: convertScore(w.domain_score),
        }));
        const workValuesEl = document.getElementById('work_value');
        if (workValuesEl instanceof HTMLElement) {
            const workValuesRadar = new Radar(
                workValuesEl,
                (window as SafeAny).radarOptions(workValueData),
            );
            workValuesRadar.render();
        }
    }
};
