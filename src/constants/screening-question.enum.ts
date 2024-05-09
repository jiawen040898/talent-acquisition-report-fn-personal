export enum ScreeningQuestionWidgetType {
    SINGLE_SELECTION = 'single_selection',
    MULTIPLE_SELECTION = 'multiple_selection',
    DROPDOWN = 'dropdown',
    SHORT_TEXT = 'short_text',
    LONG_TEXT = 'long_text',
}

export const FILTERABLE_WIDGETS = [
    ScreeningQuestionWidgetType.SINGLE_SELECTION,
    ScreeningQuestionWidgetType.MULTIPLE_SELECTION,
    ScreeningQuestionWidgetType.DROPDOWN,
];
