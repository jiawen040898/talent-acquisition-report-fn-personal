import {
    Auth0Credentials,
    cacheService,
    generatorUtil,
    logger,
    secretService,
} from '@pulsifi/fn';
import { authService } from '@pulsifi/fn/services/auth';
import axios from 'axios';

import * as AWSConfig from '../configs';
import { CacheObject } from '../constants';
import { CompanyRes } from '../interface';

export class CompanyService {
    private baseApiUrl = `${AWSConfig.alb().dns}/identity/v1.0`;
    static getCompanyById: unknown;

    async getCompanyById(companyId: number): Promise<CompanyRes> {
        try {
            const url = `${this.baseApiUrl}/companies/${companyId}`;

            const cacheKey = generatorUtil.cacheKey(
                CacheObject.COMPANY_ID,
                companyId,
            );

            const result = await cacheService.get<CompanyRes>(cacheKey);
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

            const responseData = await axios
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    return response.data.data;
                });

            return responseData;
        } catch (err) {
            logger.error('Fail to getCompanyById', { err });
            throw err;
        }
    }
}
