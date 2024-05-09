export interface Meta {
    type: string;
    message: unknown;
}

export interface Response<T> {
    data: T;
    meta?: Meta | null;
}

export interface PageResponse<T> {
    data: {
        total_count: number;
        result: T[];
    };
    meta?: Meta | null;
}
