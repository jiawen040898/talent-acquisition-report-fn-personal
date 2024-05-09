export type RatingScore = 0 | 1 | 2 | 3 | 4 | 5;

export interface RatingCompetency {
    skill: string;
    match: boolean;
}

export interface QuestionContents {
    question: string;
    additionals: string[];
}

export interface RatingStats {
    value: RatingScore;
    total: number;
}

export interface QuestionSchema {
    ui: QuestionWidget;
    required: boolean;
}

export interface QuestionWidget {
    widget: string; //rate, short_text, single_selection
    enum?: string[]; //["Yes", "No"]
    title?: string;
}

export interface QuestionAnswer {
    value: SafeAny; //["Yes"]
}
