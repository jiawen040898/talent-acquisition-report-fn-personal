import { JobApplicationStatus } from '../../src/constants';
import Handlebars from '../../src/services/handlebars.service';

const dateOneWeekAgo = new Date();
dateOneWeekAgo.setDate(dateOneWeekAgo.getDate() - 7);

describe('handlebars', () => {
    it.each([
        [56.78, 57],
        [undefined, 0],
    ])(
        'should return expected string when call toPercentage with num %s',
        (num, expectedPercentage) => {
            // Arrange
            const template = '<p>{{toPercentage num}}</p>';
            const data = {
                num,
            };

            // Act
            const actual = Handlebars.compile(template)(data);

            // Assert
            expect(actual).toEqual(`<p>${expectedPercentage}</p>`);
        },
    );

    it.each([
        [56.78, 57],
        [undefined, 0],
    ])(
        'should return expected string when call toPercentage with num %s',
        (num, expectedPercentage) => {
            // Arrange
            const template = '<p>{{toPercentage num}}</p>';
            const data = {
                num,
            };

            // Act
            const actual = Handlebars.compile(template)(data);

            // Assert
            expect(actual).toEqual(`<p>${expectedPercentage}</p>`);
        },
    );

    it.each([
        [0.56, 56],
        [undefined, 0],
    ])(
        'should return expected string when call convertScoreToPercentage with num %s',
        (num, expectedPercentage) => {
            // Arrange
            const template = '<p>{{convertScoreToPercentage num}}</p>';
            const data = {
                num,
            };

            // Act
            const actual = Handlebars.compile(template)(data);

            // Assert
            expect(actual).toEqual(`<p>${expectedPercentage}</p>`);
        },
    );

    it.each([
        [4.1, 41],
        [undefined, 0],
    ])(
        'should return expected string when call convertFitScoreToPercentage with num %s',
        (num, expectedPercentage) => {
            // Arrange
            const template = '<p>{{convertFitScoreToPercentage num}}</p>';
            const data = {
                num,
            };

            // Act
            const actual = Handlebars.compile(template)(data);

            // Assert
            expect(actual).toEqual(`<p>${expectedPercentage}</p>`);
        },
    );

    it.each([
        ['pulsifi', 'Pulsifi'],
        ['pulsifi-engineers', 'Pulsifi Engineers'],
    ])(
        'should return expected string when call toCapitalizedWords with "%s" string',
        (string, expectedString) => {
            // Arrange
            const template = '<p>{{toCapitalizedWords string}}</p>';
            const data = {
                string,
            };

            // Act
            const actual = Handlebars.compile(template)(data);

            // Assert
            expect(actual).toEqual(`<p>${expectedString}</p>`);
        },
    );

    it.each([
        [
            JobApplicationStatus.SHORTLISTED,
            'shortlisted translated',
            'Shortlisted Translated',
        ],
        [
            JobApplicationStatus.OFFERED,
            'offered translated',
            'Offered Translated',
        ],
        [JobApplicationStatus.SOURCED, undefined, 'Applied Translated'],
    ])(
        'should return expected string when call getTranslatedApplicationStatus with %s status',
        (status, translateText, expectedString) => {
            // Arrange
            const template =
                '<p>{{getTranslatedApplicationStatus application_status applicationStatusText}}</p>';
            const data = {
                application_status: status,
                applicationStatusText: {
                    [status]: translateText,
                    [JobApplicationStatus.APPLIED]: 'applied translated',
                },
            };

            // Act
            const actual = Handlebars.compile(template)(data);

            // Assert
            expect(actual).toEqual(`<p>${expectedString}</p>`);
        },
    );

    it.each([
        [15, '15th'],
        [1, '1st'],
        [2, '2nd'],
        [3, '3rd'],
        [undefined, '0th'],
    ])(
        'should return expected string when call numberToOrdinal with num %s',
        (num, expectedPercentage) => {
            // Arrange
            const template = '<p>{{numberToOrdinal num}}</p>';
            const data = {
                num,
            };

            // Act
            const actual = Handlebars.compile(template)(data);

            // Assert
            expect(actual).toEqual(`<p>${expectedPercentage}</p>`);
        },
    );

    it.each([[dateOneWeekAgo, '7 days']])(
        'should return expected string when call timeSince with "%s" string',
        (string, expectedString) => {
            // Arrange
            const template = '<p>{{timeSince string}}</p>';
            const data = {
                string,
            };

            // Act
            const actual = Handlebars.compile(template)(data);

            // Assert
            expect(actual).toEqual(`<p>${expectedString}</p>`);
        },
    );

    it.each([
        ['other_type', 'Not Equal'],
        ['interview_template', ''],
    ])(
        'should return expected string when call ifNotEquals with params (%s)',
        (questionType, expectedString) => {
            // Arrange
            const template = `{{#ifNotEquals this.question_type 'interview_template'}}Not Equal{{/ifNotEquals}}`;
            const data = {
                question_type: questionType,
            };

            // Act
            const actual = Handlebars.compile(template)(data);

            // Assert
            expect(actual).toEqual(expectedString);
        },
    );

    it.each([
        ['interview_template', 'Equal'],
        ['other_type', ''],
    ])(
        'should return expected string when call ifEquals with params (%s)',
        (questionType, expectedString) => {
            // Arrange
            const template = `{{#ifEquals this.question_type 'interview_template'}}Equal{{/ifEquals}}`;
            const data = {
                question_type: questionType,
            };

            // Act
            const actual = Handlebars.compile(template)(data);

            // Assert
            expect(actual).toEqual(expectedString);
        },
    );

    it('should return expected string when call json', () => {
        // Arrange
        const template = `<p>{{ json theJson }}</p>`;
        const data = {
            theJson: {
                key1: 'value1',
            },
        };

        // Act
        const actual = Handlebars.compile(template)(data);

        // Assert
        expect(actual).toEqual('<p>{"key1":"value1"}</p>');
    });

    it.each([
        [7.1, 'high'],
        [undefined, 'low'],
    ])(
        'should return expected string when call colorizeScore with num %s',
        (num, expectedString) => {
            // Arrange
            const template = '<p>{{colorizeScore num}}</p>';
            const data = {
                num,
            };

            // Act
            const actual = Handlebars.compile(template)(data);

            // Assert
            expect(actual).toEqual(`<p>${expectedString}</p>`);
        },
    );

    it.each([
        ['high', '<p class="dimension high">High</p>'],
        ['average', '<p class="dimension average">Average</p>'],
        ['low', '<p class="dimension low">Low</p>'],
    ])(
        'should return expected string when call dimensionLevel with %s',
        (value, expectedString) => {
            // Arrange
            const template =
                '{{#dimensionLevel this.dimension_level}}<p class="">{{this}}</p>{{/dimensionLevel}}';
            const data = {
                dimension_level: value,
            };

            // Act
            const actual = Handlebars.compile(template)(data);

            // Assert
            expect(actual).toEqual(expectedString);
        },
    );

    it.each([
        [1, 'Very poor'],
        [2, 'Poor'],
        [3, 'Average'],
        [4, 'Good'],
        [5, 'Excellent'],
        [NaN, 'NaN'],
    ])(
        'should return expected string when call answerValue with value %s',
        (value, expectedString) => {
            // Arrange
            const template = '{{answerValue value translateText}}';
            const data = {
                value,
                translateText: {
                    veryPoor: 'Very poor',
                    poor: 'Poor',
                    average: 'Average',
                    good: 'Good',
                    excellent: 'Excellent',
                },
            };

            // Act
            const actual = Handlebars.compile(template)(data);

            // Assert
            expect(actual).toEqual(expectedString);
        },
    );

    it.each([
        [
            4,
            '<span class="rating-icon" value="1">${ICON_STAR}</span><span class="rating-icon" value="1">${ICON_STAR}</span><span class="rating-icon" value="1">${ICON_STAR}</span><span class="rating-icon" value="1">${ICON_STAR}</span><span class="rating-icon" value="">${ICON_STAR}</span>',
        ],
        [0, ''],
        [undefined, ''],
        [NaN, ''],
    ])(
        'should return expected string when call loopIcon with %s',
        (rating, expectedString) => {
            // Arrange
            const template =
                '{{#loopIcon interview_rating_summary.interview_average_rating}}<span class="rating-icon" value="">${ICON_STAR}</span>{{/loopIcon}}';
            const data = {
                interview_rating_summary: {
                    interview_average_rating: rating,
                },
            };

            // Act
            const actual = Handlebars.compile(template)(data);

            // Assert
            expect(actual).toEqual(expectedString);
        },
    );

    it('should return expected string when call replaceValue', () => {
        // Arrange
        const template = `{{ replaceValue valueToReplace newValue }}`;
        const data = {
            valueToReplace: 'valueToReplace',
            newValue: 'newValue',
        };

        // Act
        const actual = Handlebars.compile(template)(data);

        // Assert
        expect(actual).toEqual('newValue');
    });

    it.each([
        ['', '', '', 'interview_template', ''],
        ['1', '2', '3', '', ''],
        ['1', '', '', '', ''],
        ['', '2', '', '', ''],
        ['', '', '3', '', ''],
        ['', '', '', '', 'hidden'],
    ])(
        'should return expected string when call ifOneEmptyThenHide with params (%s, %s, %s, %s)',
        (arg1, arg2, arg3, questionType, expectedString) => {
            // Arrange
            const template =
                '{{ifOneEmptyThenHide arg1 arg2 arg3 questionType }}';
            const data = {
                arg1,
                arg2,
                arg3,
                questionType,
            };

            // Act
            const actual = Handlebars.compile(template)(data);

            // Assert
            expect(actual).toEqual(expectedString);
        },
    );

    it.each([
        [true, 0, 'text'],
        [false, 0, ''],
        [true, 1, ''],
    ])(
        'should return expected string when call isAnd with params (%s, %s)',
        (cond1, cond2, expectedString) => {
            // Arrange
            const template = `{{#isAnd cond1 cond2}}text{{/isAnd}}`;
            const data = {
                cond1,
                cond2,
            };

            // Act
            const actual = Handlebars.compile(template)(data);

            // Assert
            expect(actual).toEqual(expectedString);
        },
    );

    it.each([
        ['role_fit', 'Role Fit Questions'],
        ['culture_fit', 'Culture Fit Questions'],
        ['other_fit', 'Other Fit'],
    ])(
        'should return expected string when call transformQuestionType with params (%s)',
        (questionType, expectedString) => {
            // Arrange
            const template = '{{transformQuestionType questionType }}';
            const data = {
                questionType,
            };

            // Act
            const actual = Handlebars.compile(template)(data);

            // Assert
            expect(actual).toEqual(expectedString);
        },
    );

    it.each([
        [
            '2023-01-31T20:12:34.567Z',
            'en-GB',
            'Asia/Kuala_Lumpur',
            '01 Feb 2023',
        ],
        [
            '2023-01-31T20:12:34.567Z',
            'en-GB',
            'Europe/Amsterdam',
            '31 Jan 2023',
        ],
    ])(
        'should return expected string when call transformQuestionType with params (%s, %s, %s)',
        (date, language, timezone, expectedString) => {
            // Arrange
            const template = '{{dateToLocaleString date language timezone }}';
            const data = {
                date,
                language,
                timezone,
            };

            // Act
            const actual = Handlebars.compile(template)(data);

            // Assert
            expect(actual).toEqual(expectedString);
        },
    );

    it('should return expected string when call eachWithSortObject', () => {
        // Arrange
        const template = `{{#eachWithSortObject questions }}{{ json this }}{{/eachWithSortObject}}`;
        const data = {
            questions: {
                q1: [
                    {
                        question_type: 'other',
                    },
                ],
                q2: [
                    {
                        question_type: 'interview_template',
                    },
                ],
                q3: [
                    {
                        question_type: 'other',
                    },
                ],
                q4: [
                    {
                        question_type: 'interview_template',
                    },
                ],
            },
        };

        // Act
        const actual = Handlebars.compile(template)(data);

        // Assert
        expect(actual).toEqual(
            '{"key":"q2","value":[{"question_type":"interview_template"}]}{"key":"q4","value":[{"question_type":"interview_template"}]}{"key":"q3","value":[{"question_type":"other"}]}{"key":"q1","value":[{"question_type":"other"}]}',
        );
    });

    it.each([
        [5.23, 5.2],
        [undefined, 0],
    ])(
        'should return expected string when call toOneDecimal with num %s',
        (num, expectedPercentage) => {
            // Arrange
            const template = '<p>{{toOneDecimal num}}</p>';
            const data = {
                num,
            };

            // Act
            const actual = Handlebars.compile(template)(data);

            // Assert
            expect(actual).toEqual(`<p>${expectedPercentage}</p>`);
        },
    );

    it('should return expected string when call groupBy', () => {
        // Arrange
        const template = `{{#groupBy experiences.skills 'proficiency'}}{{ json this }}{{/groupBy}}`;
        const data = {
            experiences: {
                skills: [
                    {
                        name: 'Product Launch',
                        source: 'candidate',
                        proficiency: 'expert',
                        match: false,
                    },
                    {
                        name: 'Adobe XD',
                        source: 'candidate',
                        proficiency: 'expert',
                        match: true,
                    },
                    {
                        name: 'Project Management',
                        source: 'candidate',
                        proficiency: 'expert',
                        match: true,
                    },
                    {
                        name: 'Data Analysis',
                        source: 'candidate',
                        proficiency: 'novice',
                        match: true,
                    },
                    {
                        name: 'Communication Skills',
                        source: 'candidate',
                        proficiency: 'proficient',
                        match: true,
                    },
                    {
                        name: 'Communication Skills',
                        source: 'candidate',
                        proficiency: 'competent',
                        match: true,
                    },
                    {
                        name: 'Communication Skills',
                        source: 'candidate',
                        proficiency: 'beginner',
                        match: true,
                    },
                ],
            },
        };

        // Act
        const actual = Handlebars.compile(template)(data);

        // Assert
        expect(actual).toEqual(
            '{"expert":[{"name":"Product Launch","source":"candidate","proficiency":"expert","match":false},{"name":"Adobe XD","source":"candidate","proficiency":"expert","match":true},{"name":"Project Management","source":"candidate","proficiency":"expert","match":true}],"novice":[{"name":"Data Analysis","source":"candidate","proficiency":"novice","match":true}],"proficient":[{"name":"Communication Skills","source":"candidate","proficiency":"proficient","match":true}],"competent":[{"name":"Communication Skills","source":"candidate","proficiency":"competent","match":true}],"beginner":[{"name":"Communication Skills","source":"candidate","proficiency":"beginner","match":true}]}',
        );
    });

    it.each([
        ['2023-01-31T20:12:34.567Z', 'en-GB', 'Asia/Kuala_Lumpur', 'Feb 2023'],
        ['2023-01-31T20:12:34.567Z', 'en-GB', 'Europe/Amsterdam', 'Jan 2023'],
    ])(
        'should return expected string when call transformQuestionType with params (%s, %s, %s)',
        (date, language, timezone, expectedString) => {
            // Arrange
            const template =
                '{{formatMonthYearByLocaleAndTimezone date language timezone }}';
            const data = {
                date,
                language,
                timezone,
            };

            // Act
            const actual = Handlebars.compile(template)(data);

            // Assert
            expect(actual).toEqual(expectedString);
        },
    );
});
