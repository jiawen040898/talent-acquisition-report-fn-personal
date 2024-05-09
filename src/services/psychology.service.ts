import {
    ApiResponse,
    Auth0Credentials,
    cacheService,
    ErrorDetails,
    generatorUtil,
    Locale,
    logger,
    secretService,
} from '@pulsifi/fn';
import { authService } from '@pulsifi/fn/services/auth';
import axios from 'axios';

import * as AWSConfig from '../configs';
import {
    CacheObject,
    PsychologyApiErrorCode,
    PsychologyApiErrorMessage,
    PsychologyApiErrorType,
} from '../constants';
import { FitScoreRecipeDto } from '../dtos';
import { PersonalityFrameworkDetails, Response } from '../interface';

export class PsychologyService {
    private baseApiUrl = `${AWSConfig.alb().dns}/psychology/v1.0`;

    async getFrameworkDetails(
        frameworkAlias: string,
        language: string = Locale.EN_US,
    ): Promise<PersonalityFrameworkDetails> {
        try {
            let result;
            const url = `${this.baseApiUrl}/frameworks/alias/${frameworkAlias}/description`;
            const cacheKey = generatorUtil.cacheKey(
                CacheObject.PERSONALITY_FRAMEWORK_DETAIL,
                frameworkAlias,
                CacheObject.PSYCHOLOGY_LANGUAGE,
                language,
            );

            result =
                await cacheService.get<PersonalityFrameworkDetails>(cacheKey);

            if (result) {
                return result;
            }

            const auth0Secret = await secretService.getSecret<Auth0Credentials>(
                process.env.AUTH0_SM_NAME as string,
            );

            const token = await authService.getMachineToken({
                client_id: auth0Secret.AUTH0_ENTERPRISE_M2M_CLIENT_ID,
                client_secret: auth0Secret.AUTH0_ENTERPRISE_M2M_CLIENT_SECRET,
                audience: `${AWSConfig.auth0().audience}`,
                grant_type: `${AWSConfig.auth0().grantType}`,
                domain: `${AWSConfig.auth0().domain}`,
            });

            result = await axios
                .get<Response<PersonalityFrameworkDetails>>(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    return response.data.data;
                });

            return result;
        } catch (err) {
            logger.error('Fail to getFrameworkDetails', { err });
            throw err;
        }
    }

    async getFitScoreRecipeById(recipeId: string): Promise<FitScoreRecipeDto> {
        const fitScoreRecipeCacheKey = generatorUtil.cacheKey(
            CacheObject.FIT_SCORE_RECIPE_ID,
            recipeId,
        );

        const cachedData = await cacheService.get<FitScoreRecipeDto>(
            fitScoreRecipeCacheKey,
        );

        if (cachedData) {
            return cachedData;
        }

        const auth0Config = AWSConfig.auth0();

        const auth0Secret = await secretService.getSecret<Auth0Credentials>(
            auth0Config.secretName,
        );
        const baseApiUrl = `${AWSConfig.alb().dns}/psychology/v1.0`;
        const path = `${baseApiUrl}/fit_score_recipes/${recipeId}`;

        const token = await authService.getMachineToken({
            client_id: auth0Secret.AUTH0_ENTERPRISE_M2M_CLIENT_ID,
            client_secret: auth0Secret.AUTH0_ENTERPRISE_M2M_CLIENT_SECRET,
            audience: `${auth0Config.audience}`,
            grant_type: `${auth0Config.grantType}`,
            domain: `${auth0Config.domain}`,
        });

        try {
            const res = await axios.get<ApiResponse<FitScoreRecipeDto>>(path, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return res.data.data as FitScoreRecipeDto;
        } catch (err) {
            throw new FailedToGetFitScoreRecipeByIdFromPsychologyApi({
                error_codes: [
                    PsychologyApiErrorCode.FAILED_TO_GET_FIT_SCORE_RECIPE,
                ],
                err,
            });
        }
    }
}

export class FailedToGetFitScoreRecipeByIdFromPsychologyApi extends Error {
    errorDetails: ErrorDetails;

    constructor(errorDetails: ErrorDetails) {
        super(PsychologyApiErrorMessage.FAILED_TO_GET_FIT_SCORE_RECIPE);
        this.name = PsychologyApiErrorType.FAILED_TO_GET_FIT_SCORE_RECIPE;
        this.errorDetails = errorDetails;
    }
}
