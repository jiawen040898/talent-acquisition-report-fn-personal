export interface CompanyRes {
    id: number;
    name: string;
    slug: string;
    timezone: string;
    locales: CompanyLocale[];
}

export class CompanyLocale {
    locale!: string;
    is_default!: boolean;
}

export class CompanyProduct {
    module!: string;
}
