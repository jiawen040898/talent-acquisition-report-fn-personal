export enum JobStatus {
    ACTIVE = 'active',
    CLOSED = 'closed',
    DRAFT = 'draft',
    ARCHIVED = 'archived',
}

export enum EmploymentType {
    FULLTIME = 'fulltime',
    PARTTIME = 'parttime',
    FULLTIME_PARTTIME = 'fulltime/parttime',
    INTERNSHIP = 'internship',
    CONTRACT = 'contract',
    FREELANCE = 'freelance',
}

export enum AssessmentInviteOption {
    ALL = 'all',
    QUALIFIED_ONLY = 'qualified_only',
    NONE = 'none',
}

export enum VideoInviteOption {
    ALL = 'all',
    NONE = 'none',
}

export enum RoleFitModel {
    NONE = 'none',
    DYNAMIC = 'dynamic',
    RESUME = 'resume',
    TEMPLATE = 'template',
    ASSESSMENT = 'assessment',
}
