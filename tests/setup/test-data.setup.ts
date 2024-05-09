import { AuditDataEntity } from '../../src/models/audit-data.entity';

const createdBy = 1;
const now = new Date();
const auditData: AuditDataEntity = {
    created_at: now,
    created_by: createdBy,
    updated_at: now,
    updated_by: createdBy,
};

export const TestData = {
    companyId: 5,
    createdBy: 1,
    createdUsername: 'Jay Pete',
    firstName: 'Jay',
    lastName: 'Pete',
    email: 'jaypete@gmail.com',
    companyName: 'Pulsifi',
    now: new Date(),
    companySlug: 'bitcoin-inc',
    companyLocales: [
        {
            locale: 'en-US',
            is_default: true,
        },
        {
            locale: 'pt-BR',
            is_default: false,
        },
    ],
    companyTimezone: 'Asia/Kuala_Lumpur',
    auditData,
};
