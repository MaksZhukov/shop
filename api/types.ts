export const enum ErrorTypes {
    ValidationError = 'ValidationError',
}

export type ApiResponse<T = any> = {
    data: T;
    meta: {
        pagination?: {
            page: number;
            pageCount: number;
            pageSize: number;
            total: number;
        };
    };
};

export type CollectionParams = {
    sort?: string[] | string;
    filters?: {
        [field: string]: {
            [operator: string]: string | undefined;
        } | number[];
    };
    populate?: string[] | string;
    fields?: string[];
    pagination?: {
        page?: number;
        pageSize?: number;
        limit?: number;
    };
    publicationState?: 'live' | 'preview';
};
