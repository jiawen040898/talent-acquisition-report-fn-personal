/* eslint-disable @typescript-eslint/ban-ts-comment */
import { dateTimeUtil } from '@pulsifi/fn';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import Handlebars from 'handlebars';
import { groupBy } from 'lodash';

import { JobApplicationStatus } from '../constants';
import { ApplicationStatusText } from '../interface';
import { toCapitalizedWords } from '../utils';

// @deprecated Since scores will be 0..1
Handlebars.registerHelper('toPercentage', function (num = 0) {
    return num.toFixed(0);
});

Handlebars.registerHelper('convertScoreToPercentage', function (num = 0) {
    return num > 0 ? (num * 100).toFixed(0) : 0;
});

Handlebars.registerHelper('convertFitScoreToPercentage', function (num = 0) {
    return (num * 10).toFixed(0);
});

Handlebars.registerHelper('toCapitalizedWords', function (string) {
    return toCapitalizedWords(string);
});

Handlebars.registerHelper(
    'getTranslatedApplicationStatus',
    function (
        applicationStatus: JobApplicationStatus,
        translateText: ApplicationStatusText,
    ) {
        const string =
            translateText[applicationStatus] ?? translateText.applied;

        return toCapitalizedWords(string);
    },
);

Handlebars.registerHelper('numberToOrdinal', function (num = 0) {
    num = Math.abs(num);
    const cent = num % 100;
    if (cent >= 10 && cent <= 20) {
        return num + 'th';
    }
    const dec = num % 10;
    if (dec === 1) {
        return num + 'st';
    }
    if (dec === 2) {
        return num + 'nd';
    }
    if (dec === 3) {
        return num + 'rd';
    }
    return num + 'th';
});

Handlebars.registerHelper('timeSince', function (dateString) {
    return formatDistanceToNowStrict(new Date(dateString));
});

Handlebars.registerHelper('ifNotEquals', function (a, b, options) {
    if (a !== b) {
        // @ts-ignore: ignore no implicit this
        return options.fn(this);
    }

    // @ts-ignore: ignore no implicit this
    return options.inverse(this);
});

Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
    // @ts-ignore: ignore no implicit this
    return arg1 === arg2 ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('json', function (obj) {
    return new Handlebars.SafeString(JSON.stringify(obj));
});

Handlebars.registerHelper('colorizeScore', function (num = 0) {
    const n = Number((num * 10).toFixed(0));
    if (n > 70) {
        return 'high';
    }
    if (n < 30) {
        return 'low';
    }
    return '';
});

Handlebars.registerHelper('dimensionLevel', function (value, options) {
    switch (value) {
        case 'high':
            options = options
                .fn('High')
                .replace('class=""', 'class="dimension high"');
            break;
        case 'average':
            options = options
                .fn('Average')
                .replace('class=""', 'class="dimension average"');
            break;
        case 'low':
            options = options
                .fn('Low')
                .replace('class=""', 'class="dimension low"');
            break;
    }

    return options;
});

Handlebars.registerHelper('answerValue', function (value, translateText) {
    switch (value) {
        case 1:
            value = translateText.veryPoor;
            break;
        case 2:
            value = translateText.poor;
            break;
        case 3:
            value = translateText.average;
            break;
        case 4:
            value = translateText.good;
            break;
        case 5:
            value = translateText.excellent;
            break;
        case isNaN(value):
            // @ts-ignore: ignore no implicit this
            this.value = value;
            break;
    }

    return value;
});

Handlebars.registerHelper('loopIcon', function (arg1, options) {
    const rating = [];
    const defaultValue = 5; // default 5 star icons
    //hide star icon
    if (!arg1 || arg1 == 0 || isNaN(arg1)) {
        return '';
    }

    //show star icon based on scores
    for (let i = 0; i < defaultValue; i++) {
        if (arg1 > i) {
            rating.push(options.fn().replace('value=""', 'value="1"'));
        } else {
            rating.push(options.fn());
        }
    }

    return rating.join('');
});

Handlebars.registerHelper('replaceValue', function (value, text) {
    return text.replace('{{value}}', value);
});

//to hide content if note and score and answer is not empty
Handlebars.registerHelper(
    'ifOneEmptyThenHide',
    function (arg1, arg2, arg3, questionType) {
        if (questionType == 'interview_template') {
            return '';
        }

        const value = arg1 || arg2 || arg3;

        return !value ? 'hidden' : '';
    },
);

Handlebars.registerHelper('isAnd', function (cond1, cond2, options) {
    // @ts-ignore: ignore no implicit this
    return cond1 && cond2 == 0 ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('transformQuestionType', function (value) {
    const specified = ['role_fit', 'culture_fit'];
    const prefixText = specified.includes(value) ? ' Questions' : '';

    value = toCapitalizedWords(value) + prefixText;

    return value;
});

Handlebars.registerHelper(
    'dateToLocaleString',
    function (value, language, timezone) {
        const date = new Date(value)
            .toLocaleString(language, {
                timeZone: timezone,
                year: 'numeric',
                month: 'short',
                day: '2-digit',
            })
            .replace(',', '');

        return date;
    },
);

Handlebars.registerHelper('eachWithSortObject', function (object, options) {
    let sortedData = '';

    // to show interview_template at first position
    const ordered = Object.keys(object)
        .sort((a, b) => {
            return object[b][0].question_type == 'interview_template' ? 1 : -1;
        })
        .reduce((obj: SafeAny, key) => {
            obj[key] = object[key];
            return obj;
        }, {});

    // loop through the sorted objects
    Object.keys(ordered).forEach(function (prop) {
        sortedData += options.fn({ key: prop, value: ordered[prop] });
    });

    return sortedData;
});

Handlebars.registerHelper('groupBy', function (object, key, options) {
    const groupedData = groupBy(object, key);
    return options.fn(groupedData);
});

Handlebars.registerHelper('toOneDecimal', function (num) {
    return num ? Number(num).toFixed(1) : 0;
});

Handlebars.registerHelper(
    'formatMonthYearByLocaleAndTimezone',
    function (date, lang, timezone) {
        return dateTimeUtil.formatByLocaleAndTimezone(
            date,
            lang,
            timezone,
            'MMM YYYY',
        );
    },
);

Handlebars.registerHelper(
    'calculateBarWidthWithIngredients',
    function (weightage, score) {
        return (score / weightage) * 100;
    },
);

Handlebars.registerHelper('generateHeatTag', function (index, score) {
    const heatTagIndex = score && score > 0 ? 10 - index : 0;
    const cssClass = `heat-tag-${heatTagIndex}`; // 10 heat tags only
    return new Handlebars.SafeString(`${cssClass}`);
});

Handlebars.registerHelper('generateProgressBarFill', function (score) {
    let scoreType = 'average';

    if (score > 0.7) {
        scoreType = 'high';
    } else if (score < 0.3) {
        scoreType = 'low';
    }

    const cssClass = `fill-${scoreType}`;
    return new Handlebars.SafeString(`${cssClass}`);
});

export default Handlebars;
