export interface IEmailPayload {
    changed_by: number;
    receiver_id: string;
    receiver_email: string;
    email_type_id: number;
    email_template_id: number;
    company_slug: string;
    company_id: number;
    send_email: boolean;
    payload: {
        first_name: string;
        job_title?: string;
        tm_employee_app_url?: string;
        company_name?: string;
    };
}

export interface TemplateVariable {
    first_name: string;
    last_name: string;
    email: string;
    job_title: string;
    company_name: string;
    download_link: string;
    invite_link: string;
    set_password_link: string;
}

export enum EmailActivityMessageRecipientGroup {
    CANDIDATE = 'candidate',
    USER = 'user',
}

export interface EmailRequest {
    recipient_email: string;
    recipient_group: EmailActivityMessageRecipientGroup;
    recipient_id?: string;
    company_id?: number;
    email_template_id?: number;
    email_communication_type?: string;
    variables: Partial<TemplateVariable>;
}
