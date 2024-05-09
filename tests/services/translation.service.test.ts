import { DEFAULT_LOCALE } from '@pulsifi/fn';
import { translationService } from '@pulsifi/fn/services/translation';

import { translationServiceConfig } from '../../src/configs';
import { testData } from './fixtures/translation.service.test-data';

const mockTranslationService = jest.fn();
translationService.getData = mockTranslationService;

describe('translationService', () => {
    describe('getTranslationData', () => {
        it.each([
            [DEFAULT_LOCALE, testData.englishTranslation],
            ['pt-BR', testData.portugueseBrazilTranslation],
            ['Unknown-Locale', testData.englishTranslation],
        ])(
            `should return expected data in %s`,
            async (locale, expectedData) => {
                // Arrange
                mockTranslationService.mockReturnValue(expectedData);

                // Act
                const actual = await translationService.getData(
                    locale,
                    translationServiceConfig,
                );
                // Assert
                expect(actual).toEqual(expectedData);
            },
        );
    });
});
